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
                'children' => ['CNC Machines', 'Hydraulic Presses', 'Air Compressors']
            ],
            [
                'name' => 'Electronics & Electrical',
                'is_featured' => true,
                'children' => ['PLC Controllers', 'Circuit Breakers', 'Sensors']
            ],
            [
                'name' => 'Automotive Components',
                'is_featured' => true,
                'children' => ['Gears', 'Bearings', 'Brakes']
            ],
            [
                'name' => 'Steel & Raw Materials',
                'is_featured' => true,
                'children' => ['Steel Coils', 'Stainless Sheets', 'Copper Wires']
            ],
            [
                'name' => 'Chemicals & Supplies',
                'is_featured' => false,
                'children' => ['Industrial Grease', 'Solvents']
            ],
            [
                'name' => 'Construction & Real Estate',
                'is_featured' => true,
                'children' => ['Cement & Concrete', 'H-Beams', 'Rebars']
            ],
            [
                'name' => 'IT & Enterprise Hardware',
                'is_featured' => true,
                'children' => ['Enterprise Servers', 'AI Edge Gateways', 'Spine Switches']
            ],
            [
                'name' => 'Office & Industrial Furniture',
                'is_featured' => true,
                'children' => ['Ergonomic Chairs', 'Modular Workstations', 'Steel Storage Cabinets']
            ]
        ];

        foreach ($categories as $cat) {
            $parent = Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'is_featured' => $cat['is_featured']
                ]
            );

            foreach ($cat['children'] as $childName) {
                Category::updateOrCreate(
                    ['slug' => Str::slug($childName)],
                    [
                        'name' => $childName,
                        'parent_id' => $parent->id
                    ]
                );
            }
        }
    }
}
