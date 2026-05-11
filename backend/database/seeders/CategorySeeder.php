<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Industrial Machinery',
                'is_featured' => true,
                'children' => ['Heavy Duty Equipment', 'CNC Machines', 'Generators']
            ],
            [
                'name' => 'Electronics & Electrical',
                'is_featured' => true,
                'children' => ['Power Inverters', 'Cables & Wires', 'Industrial Batteries']
            ],
            [
                'name' => 'Construction & Real Estate',
                'is_featured' => true,
                'children' => ['Cement & Concrete', 'TMT Bars', 'Paint & Wall Covering']
            ],
            [
                'name' => 'Packaging & Paper',
                'is_featured' => false,
                'children' => ['Corrugated Boxes', 'Packaging Tape', 'Wrappings']
            ],
            [
                'name' => 'Apparel, Clothing & Accessories',
                'is_featured' => false,
                'children' => ['Mens Wear', 'Workwear', 'Fabrics']
            ]
        ];

        foreach ($categories as $cat) {
            $parent = Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'is_featured' => $cat['is_featured']
            ]);

            foreach ($cat['children'] as $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'parent_id' => $parent->id
                ]);
            }
        }
    }
}
