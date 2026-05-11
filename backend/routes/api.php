<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RfqController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Public Endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Product browsing
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Category management
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/featured', [CategoryController::class, 'featured']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// 2. Protected Common Routes (JWT Verified)
Route::group(['middleware' => 'auth:api'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // 3. Seller-Only Routes
    Route::group(['middleware' => 'role:seller'], function () {
        Route::post('/seller/products', [ProductController::class, 'store']);
        Route::get('/seller/my-products', [ProductController::class, 'myProducts']);
        Route::get('/seller/dashboard', [DashboardController::class, 'sellerStats']);
        
        Route::get('/seller/rfqs', [RfqController::class, 'marketplace']); // Browse open RFQs
        Route::post('/seller/rfqs/{id}/respond', [RfqController::class, 'respond']);
    });

    // 4. Buyer-Only Routes
    Route::group(['middleware' => 'role:buyer'], function () {
        Route::get('/buyer/dashboard', [DashboardController::class, 'buyerStats']);
        
        Route::get('/buyer/rfqs', [RfqController::class, 'index']); // Their own list
        Route::post('/buyer/rfqs', [RfqController::class, 'store']); // Create new RFQ
    });
});
