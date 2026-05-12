<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'buyer_id',
        'subtotal',
        'tax_amount',
        'shipping_cost',
        'grand_total',
        'currency',
        'status',
        'payment_status',
        'payment_method',
        'gateway_transaction_id',
        'billing_address',
        'shipping_address',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
