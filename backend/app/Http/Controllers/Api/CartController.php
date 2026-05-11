<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Services\CartService;
use App\Repositories\CartRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class CartController extends Controller
{
    protected CartService $cartService;
    protected CartRepository $cartRepository;

    public function __construct(CartService $cartService, CartRepository $cartRepository)
    {
        $this->cartService = $cartService;
        $this->cartRepository = $cartRepository;
    }

    /**
     * Display current global cart view
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartRepository->getCartByUserId($request->user()->id);
        $totals = $this->cartService->calculateCartTotals($request->user()->id);

        return response()->json([
            'success' => true,
            'cart' => $cart,
            'summary' => $totals
        ]);
    }

    /**
     * Secure incremental insertion logic
     */
    public function store(AddToCartRequest $request): JsonResponse
    {
        try {
            $item = $this->cartService->addItem(
                $request->user()->id,
                $request->input('product_id'),
                $request->input('quantity')
            );

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart successfully',
                'data' => $item
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Update dynamic quantity
     */
    public function update(Request $request, int $itemId): JsonResponse
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $item = \App\Models\CartItem::findOrFail($itemId);
        $item->update(['quantity' => $request->input('quantity')]);

        return response()->json(['success' => true]);
    }

    /**
     * Atomically evict line item
     */
    public function destroy(int $itemId): JsonResponse
    {
        $item = \App\Models\CartItem::findOrFail($itemId);
        $item->delete();
        return response()->json(['success' => true]);
    }
}
