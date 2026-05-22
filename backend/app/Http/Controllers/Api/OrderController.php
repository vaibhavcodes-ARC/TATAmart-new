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

        return $this->successResponse($orders, 'Orders retrieved successfully');
    }

    /**
     * Atomically finalize checkout and register an Order.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'shippingAdd' => 'required|string|min:5',
            'items' => 'nullable|array',
            'items.*.product_id' => 'required_with:items|integer|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1'
        ]);

        try {
            // If the client provides an explicit `items` payload, create the
            // order from that payload to avoid race conditions where the
            // server-side cart may have been cleared before the request.
            if ($request->has('items') && is_array($request->input('items'))) {
                $order = $this->orderService->createFromPayload(
                    $request->user()->id,
                    $request->only('shippingAdd'),
                    $request->input('items')
                );
            } else {
                $order = $this->orderService->createFromCart(
                    $request->user()->id,
                    $request->only('shippingAdd')
                );
            }

            return $this->successResponse($order, 'Order placed successfully', 201);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
