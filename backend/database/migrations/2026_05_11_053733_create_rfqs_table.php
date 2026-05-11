<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->string('product_name');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->text('description');
            $table->decimal('quantity', 10, 2);
            $table->string('unit');
            $table->string('expected_price')->nullable();
            $table->enum('status', ['open', 'closed', 'cancelled'])->default('open');
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });

        Schema::create('rfq_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rfq_id')->constrained()->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->decimal('offered_price', 12, 2);
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfq_responses');
        Schema::dropIfExists('rfqs');
    }
};
