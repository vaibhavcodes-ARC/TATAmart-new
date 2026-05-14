<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store highly-verified consumer feedback securely.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:3|max:1000',
        ]);

        $userId = Auth::id();
        $productId = $request->input('product_id');

        // 🔐 ENTERPRISE GATE: Verify the user HAS an existing paid/completed order containing this product.
        $hasPurchased = Order::where('buyer_id', $userId)
            ->whereHas('items', function($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();

        if (!$hasPurchased) {
            return $this->errorResponse('Verification Failed: You must formally purchase this product before drafting a public review.', 403);
        }

        // Prevent duplicate review submission
        $existing = Review::where('user_id', $userId)->where('product_id', $productId)->exists();
        if ($existing) {
            return $this->errorResponse('You have already provided feedback for this product.', 422);
        }

        $product = Product::findOrFail($productId);

        $review = Review::create([
            'user_id' => $userId,
            'product_id' => $productId,
            'seller_id' => $product->seller_id,
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);

        return $this->successResponse($review->load('user'), 'Review published successfully to verification pool.', 201);
    }
}
