<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('location_code')->nullable(); // E.g., BLR-01
            $table->text('address');
            $table->string('city')->index();
            $table->string('state');
            $table->string('pincode');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('attribute_name'); // Color, Size, Material
            $table->string('attribute_value');
            $table->timestamps();
        });

        Schema::create('product_skus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('sku_code')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->decimal('additional_price', 15, 2)->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->integer('low_stock_threshold')->default(10);
            $table->timestamps();
        });

        Schema::create('warehouse_inventory_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_sku_id')->constrained('product_skus')->onDelete('cascade');
            $table->integer('delta'); // +10, -5
            $table->string('reason')->nullable(); // sales, replenishment, return
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_inventory_logs');
        Schema::dropIfExists('product_skus');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('warehouses');
    }
};
