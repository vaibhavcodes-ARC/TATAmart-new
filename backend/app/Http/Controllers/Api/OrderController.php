<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::query()
            ->when($user->isBuyer(), fn ($query) => $query->where('buyer_id', $user->id))
            ->when($user->isSeller(), fn ($query) => $query->whereHas('items', fn ($itemQuery) => $itemQuery->where('seller_id', $user->id)))
            ->latest()
            ->get()
            ->map(fn ($order) => [
                'id' => (string) $order->id,
                'shippingAdd' => $order->shipping_address,
                'total' => (float) $order->grand_total,
                'status' => strtoupper($order->status),
                'createdAt' => optional($order->created_at)->toIso8601String(),
            ]);

        return response()->json($orders);
    }

    /**
     * Atomically finalize checkout and register an Order.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'shippingAdd' => 'required|string|min:5'
        ]);

        try {
            $order = $this->orderService->createFromCart(
                $request->user()->id,
                $request->only('shippingAdd')
            );

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
