<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::where('role', 'seller')->first();
        if (!$seller) return;

        // Clear prior iterations safely
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate();
        ProductImage::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $catalog = [
            [
                'cat_slug' => 'industrial-machinery',
                'name' => 'Industrial Diesel Generator 500kVA',
                'price' => 285000,
                'moq' => 1,
                'desc' => 'Heavy-duty industrial generator suitable for 24/7 grid backup.',
                'img' => 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'industrial-machinery',
                'name' => '3-Axis CNC Milling Machine',
                'price' => 850000,
                'moq' => 1,
                'desc' => 'Precision automated milling machine for high-throughput aluminum carving.',
                'img' => 'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'electronics-electrical',
                'name' => 'Industrial Pure Sine Inverter',
                'price' => 12500,
                'moq' => 10,
                'desc' => 'Reliable industrial power conditioning unit for servers and hardware.',
                'img' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'electronics-electrical',
                'name' => '10AWG Copper Armored Wire Reel',
                'price' => 8400,
                'moq' => 5,
                'desc' => 'Heavy-duty, fire-retardant armored building wires.',
                'img' => 'https://images.unsplash.com/photo-1558346490-a72e93cf2c04?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'construction-real-estate',
                'name' => 'TMT Steel Rebars (Fe 500D)',
                'price' => 65000,
                'moq' => 1,
                'unit' => 'ton',
                'desc' => 'High-strength, earthquake resistant reinforcement steel for multi-story structures.',
                'img' => 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'packaging-paper',
                'name' => 'Double Wall Corrugated Boxes',
                'price' => 45,
                'moq' => 500,
                'unit' => 'pcs',
                'desc' => 'High bursting strength shipping cartons for heavy shipping.',
                'img' => 'https://images.unsplash.com/photo-1589939705384-518cd1bf5074?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'apparel-clothing-accessories',
                'name' => 'Hi-Viz Reflective Safety Vest',
                'price' => 185,
                'moq' => 100,
                'unit' => 'pcs',
                'desc' => 'ANSI certified lightweight safety vests for construction zones.',
                'img' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400'
            ],
            [
                'cat_slug' => 'apparel-clothing-accessories',
                'name' => 'Corporate Cotton Polo (Bulk)',
                'price' => 320,
                'moq' => 50,
                'unit' => 'pcs',
                'desc' => '100% Bio-washed combed cotton fabric for corporate branding.',
                'img' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400'
            ]
        ];

        foreach ($catalog as $item) {
            $cat = Category::where('slug', $item['cat_slug'])->first();
            // Fallback if specific slug not found, use default first
            $catId = $cat ? $cat->id : Category::first()->id;

            $prod = Product::create([
                'seller_id' => $seller->id,
                'category_id' => $catId,
                'name' => $item['name'],
                'short_description' => $item['desc'],
                'long_description' => $item['desc'] . ' Engineered to global standard compliance.',
                'min_order_quantity' => $item['moq'],
                'unit' => $item['unit'] ?? 'unit',
                'price_min' => $item['price'],
                'price_max' => $item['price'] * 1.1,
                'currency' => 'INR',
                'is_active' => true,
                'is_featured' => true
            ]);

            ProductImage::create([
                'product_id' => $prod->id,
                'image_path' => $item['img'],
                'is_primary' => true
            ]);
        }
    }
}
