<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfqResponse extends Model
{
    protected $fillable = [
        'rfq_id', 'seller_id', 'offered_price', 'message', 'status'
    ];

    public function rfq()
    {
        return $this->belongsTo(Rfq::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
