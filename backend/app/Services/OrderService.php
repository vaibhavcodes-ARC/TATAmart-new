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
     * Create an order from a supplied payload of line items. This method
     * is used when the client posts the cart snapshot to the server to
     * avoid time-of-check races where the server-side cart may be empty.
     *
     * Expected item format: [{ product_id, quantity, product_name, price, seller_id }]
     */
    public function createFromPayload(int $userId, array $data, array $items): Order
    {
        if (empty($items)) {
            throw new Exception("Cannot process checkout with an empty cart.");
        }

        // compute totals from payload defensively
        $subtotal = 0;
        foreach ($items as $it) {
            $qty = isset($it['quantity']) ? intval($it['quantity']) : 1;
            $price = isset($it['price']) ? floatval($it['price']) : 0.0;
            $subtotal += $qty * $price;
        }

        $taxAmount = round($subtotal * 0.18, 2); // CGST+SGST 9%+9%
        $grandTotal = $subtotal + $taxAmount + 500.00; // flat freight as in frontend

        return DB::transaction(function () use ($items, $userId, $data, $subtotal, $taxAmount, $grandTotal) {
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'buyer_id' => $userId,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'grand_total' => $grandTotal,
                'currency' => 'INR',
                'billing_address' => $data['shippingAdd'] ?? 'TBD',
                'shipping_address' => $data['shippingAdd'] ?? 'TBD',
                'status' => 'pending',
                'payment_status' => 'pending'
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'] ?? null,
                    'seller_id' => $item['seller_id'] ?? $userId,
                    'product_name_snapshot' => $item['product_name'] ?? 'Product',
                    'quantity' => intval($item['quantity'] ?? 1),
                    'price_at_purchase' => floatval($item['price'] ?? 0)
                ]);
            }

            return $order;
        });
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
                    'product_name_snapshot' => $item->product->name,
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
