<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuyerProfile extends Model
{
    protected $fillable = [
        'user_id', 'company_name', 'billing_address', 'shipping_address', 'preferred_categories'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
