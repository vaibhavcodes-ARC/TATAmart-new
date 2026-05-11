<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rfq extends Model
{
    protected $fillable = [
        'buyer_id', 'product_name', 'category_id', 'description', 
        'quantity', 'unit', 'expected_price', 'status', 'expiry_date'
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function responses()
    {
        return $this->hasMany(RfqResponse::class);
    }
}
