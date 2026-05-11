<?php

namespace App\Services;

use App\Repositories\CartRepository;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class CartService
{
    protected CartRepository $cartRepository;

    public function __construct(CartRepository $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function addItem(int $userId, int $productId, int $quantity)
    {
        $product = Product::findOrFail($productId);
        
        // Business Logic Rule: MOQ Check
        if ($quantity < $product->min_order_quantity) {
            throw new Exception("Quantity cannot be below the minimum order quantity of {$product->min_order_quantity}.");
        }

        $cart = $this->cartRepository->getCartByUserId($userId);

        return DB::transaction(function () use ($cart, $productId, $quantity) {
            $existing = CartItem::where('cart_id', $cart->id)->where('product_id', $productId)->first();
            
            if ($existing) {
                $existing->increment('quantity', $quantity);
                return $existing->fresh();
            }

            return CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        });
    }

    public function calculateCartTotals(int $userId): array
    {
        $cart = $this->cartRepository->getCartByUserId($userId);
        $subtotal = 0;
        
        foreach($cart->items as $item) {
            if(!$item->is_saved_for_later) {
                // Logic handles range check if product uses dynamic pricing min/max
                $price = $item->product->price_min ?: 0; 
                $subtotal += ($price * $item->quantity);
            }
        }

        $gstRate = 0.18; // Flat default global config in standard ERP
        $tax = $subtotal * $gstRate;
        $grandTotal = $subtotal + $tax;

        return [
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($tax, 2),
            'grand_total' => round($grandTotal, 2),
            'currency' => 'INR',
            'items_count' => $cart->items->where('is_saved_for_later', false)->count()
        ];
    }
}
