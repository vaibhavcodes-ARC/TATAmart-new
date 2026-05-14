<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\ChatMessage;
use App\Events\ChatMessageSent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    /**
     * Fetch comprehensive list of current conversational streams.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Retrieve threads where user is either buyer or seller
        $conversations = Conversation::where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->with(['buyer', 'seller'])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return $this->successResponse($conversations, 'Conversations retrieved successfully');
    }

    /**
     * Pull historical message feed for a dynamic private tunnel.
     */
    public function show(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user();
        
        // Enforce strict ownership boundary
        $conversation = Conversation::where('id', $conversationId)
            ->where(function($query) use ($user) {
                $query->where('buyer_id', $user->id)
                      ->orWhere('seller_id', $user->id);
            })
            ->firstOrFail();

        $messages = ChatMessage::where('conversation_id', $conversation->id)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return $this->successResponse($messages, 'Messages retrieved successfully');
    }

    /**
     * Secure atomic injection of message and instantaneous global broadcast fire.
     */
    public function sendMessage(Request $request, int $conversationId): JsonResponse
    {
        $request->validate([
            'body' => 'required|string'
        ]);

        $user = $request->user();

        // Ownership verification lock
        $conversation = Conversation::where('id', $conversationId)
            ->where(function($query) use ($user) {
                $query->where('buyer_id', $user->id)
                      ->orWhere('seller_id', $user->id);
            })
            ->firstOrFail();

        // Save record in MariaDB
        $message = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $request->input('body')
        ]);

        // Update conversation heartbeat
        $conversation->update(['last_message_at' => now()]);

        // ⚡ FIRE THE BROADCAST ENGINE IN REALTIME
        broadcast(new ChatMessageSent($message))->toOthers();

        return $this->successResponse($message->load('sender'), 'Message sent successfully', 201);
    }
}
