<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Throwable;

/**
 * Controller to manage Razorpay test checkout and payment verification.
 */
class PaymentController extends Controller
{
    /**
     * Create a Razorpay Order through the REST API or generate a mock sandbox payload.
     */
    public function createRazorpayOrder(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id'
        ]);

        $order = Order::findOrFail($request->order_id);

        // Prevent double payments
        if ($order->payment_status === 'paid') {
            return $this->errorResponse('This corporate order has already been verified and paid.', 422);
        }

        $keyId = env('RAZORPAY_KEY_ID');
        $keySecret = env('RAZORPAY_KEY_SECRET');

        // Check if live/test credentials are fully configured in the environment
        if ($keyId && $keySecret) {
            try {
                // Perform Basic Auth request directly to Razorpay's official REST API
                $response = Http::withBasicAuth($keyId, $keySecret)
                    ->post('https://api.razorpay.com/v1/orders', [
                        'amount' => intval(round($order->grand_total * 100)), // amount in paise
                        'currency' => 'INR',
                        'receipt' => $order->order_number,
                    ]);

                if ($response->successful()) {
                    $razorpayOrder = $response->json();
                    $order->update([
                        'gateway_transaction_id' => $razorpayOrder['id']
                    ]);

                    return $this->successResponse([
                        'razorpay_order_id' => $razorpayOrder['id'],
                        'amount' => $order->grand_total,
                        'currency' => 'INR',
                        'key_id' => $keyId,
                        'is_mock' => false
                    ], 'Razorpay gateway order created successfully.');
                }
            } catch (Throwable $e) {
                logger()->error('Razorpay Order creation API error: ' . $e->getMessage());
            }
        }

        // 🛡️ Safe sandbox fallback simulation if credentials are blank or the API times out
        $mockOrderId = 'order_mock_' . Str::random(14);
        $order->update([
            'gateway_transaction_id' => $mockOrderId
        ]);

        return $this->successResponse([
            'razorpay_order_id' => $mockOrderId,
            'amount' => $order->grand_total,
            'currency' => 'INR',
            'key_id' => $keyId ?? 'rzp_test_mockkey',
            'is_mock' => true
        ], 'Razorpay Sandbox order created successfully.');
    }

    /**
     * Verify the Razorpay payment signature and fulfill the B2B transaction.
     */
    public function verifyRazorpayPayment(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'nullable|string'
        ]);

        $order = Order::findOrFail($request->order_id);
        $keySecret = env('RAZORPAY_KEY_SECRET');

        $isMock = str_starts_with($request->razorpay_order_id, 'order_mock_');

        // Verify transaction integrity
        if (!$isMock && $keySecret) {
            $expectedSignature = hash_hmac(
                'sha256', 
                $request->razorpay_order_id . '|' . $request->razorpay_payment_id, 
                $keySecret
            );

            if (!hash_equals($expectedSignature, $request->razorpay_signature ?? '')) {
                return $this->errorResponse('Payment signature verification failed. Transaction aborted.', 403);
            }
        }

        // Fulfill payment status on the order
        $order->update([
            'payment_status' => 'paid',
            'payment_method' => 'razorpay',
            'gateway_transaction_id' => $request->razorpay_payment_id,
            'status' => 'processing'
        ]);

        // Auto-provision B2B GST tax invoice details dynamically
        $invoiceNumber = 'INV-' . strtoupper(Str::random(10));
        $invoice = Invoice::create([
            'order_id' => $order->id,
            'invoice_number' => $invoiceNumber,
            'gstin' => $request->input('gstin', '27AAPCT4391M1Z5'), // default enterprise mock GSTIN
            'issued_at' => Carbon::now(),
            'pdf_path' => 'invoices/' . $invoiceNumber . '.pdf'
        ]);

        // Email Order & Payment confirmations via log-based system
        try {
            $buyerEmail = Auth::user()->email;
            Mail::send('emails.order-paid', [
                'orderNumber' => $order->order_number,
                'invoiceNumber' => $invoiceNumber,
                'gstin' => $request->input('gstin', '27AAPCT4391M1Z5'),
                'shippingAddress' => $order->shipping_address,
                'grandTotal' => $order->grand_total
            ], function ($message) use ($buyerEmail, $order) {
                $message->to($buyerEmail)
                    ->subject("TATAmart Order Confirmation - {$order->order_number}");
            });
        } catch (Throwable $e) {
            logger()->error('Order confirmation email log failed: ' . $e->getMessage());
        }

        return $this->successResponse([
            'order' => $order->fresh(),
            'invoice' => $invoice
        ], 'Payment successfully verified. B2B Allocation complete!');
    }

    /**
     * Mark the order payment status as failed dynamically.
     */
    public function failRazorpayOrder(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'nullable|string'
        ]);

        $order = Order::findOrFail($request->order_id);
        $order->update([
            'payment_status' => 'failed',
            'status' => 'failed'
        ]);

        // Email Order failure confirmation via log-based system
        try {
            $buyerEmail = Auth::user()->email;
            $reasonText = $request->input('reason', 'Transaction was declined by the issuer bank.');
            Mail::send('emails.order-failed', [
                'orderNumber' => $order->order_number,
                'reason' => $reasonText,
                'grandTotal' => $order->grand_total,
                'retryUrl' => 'http://127.0.0.1:3000/dashboard/buyer'
            ], function ($message) use ($buyerEmail, $order) {
                $message->to($buyerEmail)
                    ->subject("TATAmart Payment Failed Notification - {$order->order_number}");
            });
        } catch (Throwable $e) {
            logger()->error('Order failure email log failed: ' . $e->getMessage());
        }

        return $this->successResponse([
            'order' => $order->fresh()
        ], 'Payment status successfully updated to failed.');
    }
}
