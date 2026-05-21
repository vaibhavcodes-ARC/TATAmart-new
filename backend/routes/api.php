<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RfqController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\InvoiceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Public Endpoints
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Product browsing
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Category management
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/featured', [CategoryController::class, 'featured']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Diagnostic Test Email Endpoint
Route::get('/test-email', function () {
    try {
        $toEmail = config('mail.from.address');
        \Illuminate\Support\Facades\Mail::raw("Gmail SMTP diagnostics working successfully! Your B2B platform mailer is optimized and ready.", function ($message) use ($toEmail) {
            $message->to($toEmail)
                ->subject('TATAmart Gmail Diagnostic Vetted');
        });
        return response()->json(['success' => true, 'message' => 'Test email successfully dispatched to ' . $toEmail . '.']);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// 2. Protected Common Routes (JWT Verified)
Route::group(['middleware' => 'auth:api'], function () {
    
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/email/verify', [AuthController::class, 'verifyEmail']);
        Route::post('/email/resend', [AuthController::class, 'resendVerification']);
    });

    // 3. Shared E-commerce Flow
    Route::get('/cart', [App\Http\Controllers\Api\CartController::class, 'index']);
    Route::post('/cart/items', [App\Http\Controllers\Api\CartController::class, 'store']);
    Route::put('/cart/{itemId}', [App\Http\Controllers\Api\CartController::class, 'update']);
    Route::delete('/cart/{itemId}', [App\Http\Controllers\Api\CartController::class, 'destroy']);
    
    Route::post('/orders', [App\Http\Controllers\Api\OrderController::class, 'store']);
    
    // Razorpay Integration Endpoints
    Route::post('/payments/create-order', [PaymentController::class, 'createRazorpayOrder']);
    Route::post('/payments/verify-signature', [PaymentController::class, 'verifyRazorpayPayment']);
    Route::post('/payments/fail-order', [PaymentController::class, 'failRazorpayOrder']);
    
    // GST Tax Invoicing Endpoints
    Route::get('/orders/{id}/invoice', [InvoiceController::class, 'getInvoiceDetails']);
    Route::get('/orders/{id}/invoice/download', [InvoiceController::class, 'downloadInvoice']);
    Route::post('/orders/{id}/invoice/email', [InvoiceController::class, 'emailInvoice']);

    // 4. Real-time Conversations
    Route::get('/chat/conversations', [App\Http\Controllers\Api\ChatController::class, 'index']);
    Route::get('/chat/messages/{conversationId}', [App\Http\Controllers\Api\ChatController::class, 'show']);
    Route::post('/chat/messages/{conversationId}', [App\Http\Controllers\Api\ChatController::class, 'sendMessage']);

    // 5. Verification & Public Trust
    Route::post('/products/reviews', [App\Http\Controllers\Api\ReviewController::class, 'store']);
    Route::put('/products/reviews/{id}', [App\Http\Controllers\Api\ReviewController::class, 'update']);
    Route::delete('/products/reviews/{id}', [App\Http\Controllers\Api\ReviewController::class, 'destroy']);
    Route::post('/products/inquire', [ProductController::class, 'inquire']);
    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);

    // 4. Seller-Only Routes
    Route::group(['middleware' => 'role:seller'], function () {
        Route::get('/analytics/seller', [DashboardController::class, 'sellerAnalytics']);
        Route::post('/seller/products', [ProductController::class, 'store']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/suggest-visuals', [ProductController::class, 'suggestVisuals']);
        Route::get('/seller/my-products', [ProductController::class, 'myProducts']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::get('/seller/dashboard', [DashboardController::class, 'sellerStats']);
        
        Route::get('/seller/rfqs', [RfqController::class, 'marketplace']); // Browse open RFQs
        Route::get('/rfqs/leads', [RfqController::class, 'marketplace']);
        Route::post('/seller/rfqs/{id}/respond', [RfqController::class, 'respond']);
        Route::post('/rfqs/respond', [RfqController::class, 'respondFromBody']);
    });

    // 5. Buyer-Only Routes
    Route::group(['middleware' => 'role:buyer'], function () {
        Route::get('/buyer/dashboard', [DashboardController::class, 'buyerStats']);
        
        Route::get('/buyer/rfqs', [RfqController::class, 'index']); // Their own list
        Route::get('/rfqs/buyer', [RfqController::class, 'index']);
        Route::post('/buyer/rfqs', [RfqController::class, 'store']); // Create new RFQ
        Route::post('/rfqs', [RfqController::class, 'store']);
        Route::post('/rfqs/responses/{id}/select', [RfqController::class, 'selectResponse']);
    });

    Route::group(['middleware' => 'role:admin'], function () {
        Route::get('/admin/users', [DashboardController::class, 'adminUsers']);
        Route::get('/admin/products', [DashboardController::class, 'adminProducts']);
        Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
        Route::put('/admin/users/{id}/verify', [DashboardController::class, 'toggleUserVerification']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    });
});
