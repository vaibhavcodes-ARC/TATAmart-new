<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration to add enterprise phone country codes and local email verification parameters.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Adds country code with standard default (+91 for India)
            $table->string('phone_country_code', 10)->default('+91')->after('phone_number');
            // Holds 6-digit numeric OTP code for verifying registration
            $table->string('email_verification_code', 10)->nullable()->after('email_verified_at');
            // Stores expiry timestamp for validation rules (default 30 mins)
            $table->timestamp('email_verification_expiry')->nullable()->after('email_verification_code');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone_country_code', 'email_verification_code', 'email_verification_expiry']);
        });
    }
};
