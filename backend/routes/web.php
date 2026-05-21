<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Diagnostic Test Email Endpoint
Route::get('/test-email', function () {
    try {
        $toEmail = config('mail.from.address');
        \Illuminate\Support\Facades\Mail::raw("Gmail SMTP diagnostics working successfully! Your B2B platform mailer is optimized and ready.", function ($message) use ($toEmail) {
            $message->to($toEmail)
                ->subject('TATAmart Gmail Diagnostic Vetted');
        });
        return "SUCCESS: Test email successfully dispatched to " . $toEmail . ".";
    } catch (\Throwable $e) {
        return "ERROR: " . $e->getMessage();
    }
});
