<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerProfile extends Model
{
    protected $fillable = [
        'user_id', 'company_name', 'about_company', 'gst_number', 
        'business_address', 'city', 'state', 'zip_code', 
        'logo', 'website', 'is_verified', 'membership_type'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
