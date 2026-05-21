<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SellerProfile;
use App\Models\BuyerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin
        User::updateOrCreate(
            ['email' => 'admin@tatamart.com'],
            [
                'name' => 'Global Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number' => '9999999999',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Seller
        $seller = User::updateOrCreate(
            ['email' => 'seller@tatamart.com'],
            [
                'name' => 'TATA Industries Seller',
                'password' => Hash::make('password123'),
                'role' => 'seller',
                'phone_number' => '8888888888',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        
        SellerProfile::updateOrCreate(
            ['user_id' => $seller->id],
            [
                'company_name' => 'TATA Enterprise LLC',
                'about_company' => 'Premier industrial group based in India.',
                'gst_number' => '22AAAAA0000A1Z5',
                'business_address' => 'Bombay House, Mumbai',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'is_verified' => true,
                'membership_type' => 'premium'
            ]
        );

        // 3. Create Buyer
        $buyer = User::updateOrCreate(
            ['email' => 'buyer@tatamart.com'],
            [
                'name' => 'Global Procurement Buyer',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'phone_number' => '7777777777',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        BuyerProfile::updateOrCreate(
            ['user_id' => $buyer->id],
            [
                'company_name' => 'ProcureCorp Ltd.',
                'billing_address' => '123 Industrial Area, Bangalore',
                'shipping_address' => 'Same as Billing',
            ]
        );
    }
}
