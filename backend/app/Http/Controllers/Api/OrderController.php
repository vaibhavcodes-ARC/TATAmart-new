<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
