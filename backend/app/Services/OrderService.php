<?php

namespace App\Services;

use App\Repositories\CartRepository;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
    protected CartRepository $cartRepository;
    protected CartService $cartService;

    public function __construct(CartRepository $cartRepository, CartService $cartService)
    {
        $this->cartRepository = $cartRepository;
        $this->cartService = $cartService;
    }

    /**
     * Convert an active user cart into a locked order record atomically.
     */
    public function createFromCart(int $userId, array $data): Order
    {
        $cart = $this->cartRepository->getCartByUserId($userId);
        
        if ($cart->items->isEmpty()) {
            throw new Exception("Cannot process checkout with an empty cart.");
        }

        $summary = $this->cartService->calculateCartTotals($userId);

        return DB::transaction(function () use ($cart, $userId, $summary, $data) {
            
            // Generate immutable order record
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'buyer_id' => $userId,
                'subtotal' => $summary['subtotal'],
                'tax_amount' => $summary['tax_amount'],
                'grand_total' => $summary['grand_total'],
                'currency' => $summary['currency'],
                'billing_address' => $data['shippingAdd'] ?? 'TBD',
                'shipping_address' => $data['shippingAdd'] ?? 'TBD',
                'status' => 'pending',
                'payment_status' => 'pending'
            ]);

            // Snapshot individual line items
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'seller_id' => $item->product->seller_id ?? $userId, // Default safety fallback
                    'product_name_snapshot' => $item->product->title,
                    'quantity' => $item->quantity,
                    'price_at_purchase' => $item->product->price_min ?: 0
                ]);
            }

            // Purge the fulfilled items from the active cart atomically
            $cart->items()->delete();

            return $order;
        });
    }
}
