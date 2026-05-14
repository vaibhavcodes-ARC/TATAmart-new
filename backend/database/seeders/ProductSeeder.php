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
            // INDUSTRIAL MACHINERY
            [
                'cat_slug' => 'industrial-machinery',
                'name' => '5-Axis Automated Milling CNC Machine',
                'price' => 1250000,
                'moq' => 1,
                'desc' => 'Precision 5-axis automated milling center for high-throughput aerospace-grade titanium and aluminum carving.',
                'img' => 'https://images.unsplash.com/photo-1616788494672-87d325471252?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'industrial-machinery',
                'name' => 'Heavy-Duty 500-Ton Cold Forming Hydraulic Press',
                'price' => 840000,
                'moq' => 1,
                'desc' => 'Industrial grade cold-forming hydraulic press with structural reinforced frame and programmable logic control.',
                'img' => 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'industrial-machinery',
                'name' => 'Rotary Screw High-Pressure Air Compressor System',
                'price' => 185000,
                'moq' => 2,
                'desc' => 'Dynamic direct-drive rotary screw air compression system with integrated refrigerated air dryer and receiver tank.',
                'img' => 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600'
            ],
            // ELECTRICAL & ELECTRONICS
            [
                'cat_slug' => 'electronics-electrical',
                'name' => 'Modular High-Performance Automation PLC Controller',
                'price' => 45000,
                'moq' => 5,
                'desc' => 'Enterprise rack-mount programmable logic controller supporting dual Ethernet/IP and Profinet node topology.',
                'img' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'electronics-electrical',
                'name' => 'Vacuum Molded Low-Voltage Circuit Breaker',
                'price' => 12500,
                'moq' => 20,
                'desc' => 'High rupture capacity, molded case main circuit breaker with precise overcurrent and short-circuit trip relays.',
                'img' => 'https://images.unsplash.com/photo-1558346490-a72e93cf2c04?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'electronics-electrical',
                'name' => 'IP69K Ultrasonic Proximity Range Sensor Array',
                'price' => 3400,
                'moq' => 50,
                'desc' => 'Extremely robust ultrasonic distance detection sensor for automation lines under harsh temperatures.',
                'img' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
            ],
            // AUTOMOTIVE COMPONENTS
            [
                'cat_slug' => 'automotive-components',
                'name' => 'Heavy Logistic Truck Differential Gear Assembly',
                'price' => 75000,
                'moq' => 5,
                'desc' => 'Hardened alloy steel drive shafts and matched gearsets built for high-torque commercial truck applications.',
                'img' => 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'automotive-components',
                'name' => 'High-Load Double Row Spherical Roller Bearing',
                'price' => 2500,
                'moq' => 100,
                'desc' => 'Premium heavy-duty heat-treated steel spherical bearings designed for massive radial load and rotation.',
                'img' => 'https://images.unsplash.com/photo-1530047625168-4b29bf81140a?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'automotive-components',
                'name' => 'Carbon-Ceramic Ventilated Brake Rotor Discs',
                'price' => 14000,
                'moq' => 24,
                'desc' => 'Corrosion-resistant high-friction ventilated disk assemblies for enterprise-grade vehicular fleets.',
                'img' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600'
            ],
            // STEEL & RAW MATERIALS
            [
                'cat_slug' => 'steel-raw-materials',
                'name' => 'Hot-Rolled Carbon Steel Coil (SAE 1008)',
                'price' => 65000,
                'moq' => 5,
                'desc' => 'Prime quality flat hot-rolled structural steel coil for sheet metal pressing and automotive brackets.',
                'img' => 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'steel-raw-materials',
                'name' => 'Stainless Steel Cold-Rolled Sheets (Grade 304)',
                'price' => 120000,
                'moq' => 2,
                'desc' => 'Food-grade and chemical-resistant brushed 2B finish cold-rolled sheets for robust casing fabrication.',
                'img' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'steel-raw-materials',
                'name' => '99.9% High-Conductivity bare Copper Wire Spool',
                'price' => 210000,
                'moq' => 10,
                'desc' => 'Heavy industrial grade bare drawn electrolytic copper core coils for transformer assembly.',
                'img' => 'https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?auto=format&fit=crop&q=80&w=600'
            ],
            // CHEMICALS & SUPPLIES
            [
                'cat_slug' => 'chemicals-supplies',
                'name' => 'Multipurpose Lithium EP2 High-Temp Grease Drum',
                'price' => 12000,
                'moq' => 5,
                'desc' => 'Extreme pressure multipurpose industrial lubricating grease for heavy gears and bearing hubs.',
                'img' => 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'chemicals-supplies',
                'name' => 'High-Purity 99.9% Isopropyl Industrial Solvent',
                'price' => 35000,
                'moq' => 10,
                'desc' => 'Electronic-safe industrial grade rapid evaporation cleaning solvent for circuit assembly washes.',
                'img' => 'https://images.unsplash.com/photo-1532187863486-abf9d39d6625?auto=format&fit=crop&q=80&w=600'
            ],
            // CONSTRUCTION & REAL ESTATE
            [
                'cat_slug' => 'construction-real-estate',
                'name' => 'Vetted OPC Grade 53 High-Strength Concrete Bag',
                'price' => 420,
                'moq' => 500,
                'desc' => 'Superior compressive strength Ordinary Portland Cement vetted for multi-lane bridge decks.',
                'img' => 'https://images.unsplash.com/photo-1589939705384-518cd1bf5074?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'construction-real-estate',
                'name' => 'Structural Heavy H-Beams (Grade Fe 410)',
                'price' => 55000,
                'moq' => 10,
                'desc' => 'Universal structural steel heavy flange H-beams cut to exact specification for skeletal framing.',
                'img' => 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?auto=format&fit=crop&q=80&w=600'
            ],
            // IT & ENTERPRISE HARDWARE
            [
                'cat_slug' => 'it-enterprise-hardware',
                'name' => '2U Dual Processor Enterprise Xeon Gen4 Rack Server',
                'price' => 450000,
                'moq' => 1,
                'desc' => 'Hyperdense cloud-scale server with 256GB RAM, redundant hot-swap titanium PSUs, and SAS RAID controllers.',
                'img' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'it-enterprise-hardware',
                'name' => 'Factory Vision Cluster Jetson Edge AI Gateway',
                'price' => 89000,
                'moq' => 5,
                'desc' => 'Ultra-rugged Multi-camera real-time video analytics and tensor-core inferencing gateway node.',
                'img' => 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=600'
            ],
            [
                'cat_slug' => 'it-enterprise-hardware',
                'name' => '100GbE Core Aggregator Spine Switch QSFP28',
                'price' => 380000,
                'moq' => 1,
                'desc' => 'Ultra-low latency spine aggregation switch with wire-rate Layer 3 routing throughput.',
                'img' => 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600'
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
