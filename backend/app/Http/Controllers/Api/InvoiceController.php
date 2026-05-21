<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Throwable;

/**
 * Controller to calculate B2B GST tax splits, generate invoice sheets, download and dispatch emails.
 */
class InvoiceController extends Controller
{
    /**
     * Compute full GST metrics and return B2B tax invoice data.
     */
    public function getInvoiceDetails(int $orderId): JsonResponse
    {
        $order = Order::with(['buyer.buyerProfile', 'items.product.seller.sellerProfile', 'invoice'])
            ->findOrFail($orderId);

        // Ensure user is authorized to view this invoice (buyer, seller or admin)
        $user = Auth::user();
        if ($user->role === 'buyer' && $order->buyer_id !== $user->id) {
            return $this->errorResponse('Access Denied: You are not authorized to view this invoice.', 403);
        }

        // Auto-generate invoice database entry if none exists for this order
        $invoice = $order->invoice;
        if (!$invoice) {
            $invoiceNumber = 'INV-' . strtoupper(Str::random(10));
            $invoice = Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => $invoiceNumber,
                'gstin' => '27AAPCT4391M1Z5', // default enterprise mock GSTIN
                'issued_at' => Carbon::now(),
                'pdf_path' => 'invoices/' . $invoiceNumber . '.pdf'
            ]);
        }

        $subtotal = $order->subtotal;
        
        // Standard B2B Machinery & Hardware GST tax rate is 18% (divided into 9% CGST and 9% SGST for intrastate trade)
        $cgst = round($subtotal * 0.09, 2);
        $sgst = round($subtotal * 0.09, 2);
        $igst = 0; // default to intrastate trade splits

        $shipping = $order->shipping_cost > 0 ? $order->shipping_cost : 500.00;
        $totalTax = $cgst + $sgst;
        $grandTotal = $subtotal + $totalTax + $shipping;

        // Structured B2B Tax invoice payload
        $payload = [
            'invoice_number' => $invoice->invoice_number,
            'gstin' => $invoice->gstin,
            'issued_at' => Carbon::parse($invoice->issued_at)->format('Y-m-d H:i:s'),
            'buyer' => [
                'name' => $order->buyer->name,
                'company_name' => $order->buyer->buyerProfile->company_name ?? 'TATAmart Buyer Client',
                'email' => $order->buyer->email,
                'phone' => $order->buyer->phone_number ?? 'Not provided',
                'address' => $order->shipping_address,
            ],
            'order_number' => $order->order_number,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method ?? 'Not Paid',
            'items' => $order->items->map(function($item) {
                return [
                    'product_name' => $item->product_name_snapshot,
                    'quantity' => $item->quantity,
                    'price' => $item->price_at_purchase,
                    'total' => $item->quantity * $item->price_at_purchase,
                    'tax_rate' => '18%',
                ];
            }),
            'financials' => [
                'subtotal' => $subtotal,
                'cgst' => $cgst,
                'sgst' => $sgst,
                'igst' => $igst,
                'total_tax' => $totalTax,
                'shipping_cost' => $shipping,
                'grand_total' => $grandTotal,
                'currency' => 'INR'
            ]
        ];

        return $this->successResponse($payload, 'GST Tax Invoice details computed successfully.');
    }

    /**
     * Download print-friendly B2B tax invoice document stream.
     */
    public function downloadInvoice(int $orderId)
    {
        $order = Order::with(['buyer.buyerProfile', 'invoice'])->findOrFail($orderId);
        $invoice = $order->invoice;
        if (!$invoice) {
            return response()->json(['error' => 'No invoice generated for this order yet.'], 404);
        }

        $subtotal = $order->subtotal;
        $cgst = round($subtotal * 0.09, 2);
        $sgst = round($subtotal * 0.09, 2);
        $shipping = $order->shipping_cost > 0 ? $order->shipping_cost : 500.00;
        $grandTotal = $subtotal + $cgst + $sgst + $shipping;

        // Generate clean plain-text print invoice format
        $invoiceContent = "====================================================\n";
        $invoiceContent .= "               TATAmart B2B TAX INVOICE              \n";
        $invoiceContent .= "====================================================\n";
        $invoiceContent .= "Invoice Number : {$invoice->invoice_number}\n";
        $invoiceContent .= "GSTIN          : {$invoice->gstin}\n";
        $invoiceContent .= "Issued Date    : " . Carbon::parse($invoice->issued_at)->format('Y-m-d H:i:s') . "\n";
        $invoiceContent .= "Order Number   : {$order->order_number}\n";
        $invoiceContent .= "----------------------------------------------------\n";
        $invoiceContent .= "Buyer Company  : " . ($order->buyer->buyerProfile->company_name ?? 'TATAmart Buyer Client') . "\n";
        $invoiceContent .= "Buyer Address  : {$order->shipping_address}\n";
        $invoiceContent .= "----------------------------------------------------\n";
        $invoiceContent .= "Items Summary:\n";
        
        foreach ($order->items as $idx => $item) {
            $num = $idx + 1;
            $lineTotal = $item->quantity * $item->price_at_purchase;
            $invoiceContent .= "{$num}. {$item->product_name_snapshot} | Qty: {$item->quantity} | Price: INR {$item->price_at_purchase} | Total: INR {$lineTotal}\n";
        }
        
        $invoiceContent .= "----------------------------------------------------\n";
        $invoiceContent .= "Subtotal       : INR " . number_format($subtotal, 2) . "\n";
        $invoiceContent .= "CGST (9%)      : INR " . number_format($cgst, 2) . "\n";
        $invoiceContent .= "SGST (9%)      : INR " . number_format($sgst, 2) . "\n";
        $invoiceContent .= "Shipping Fee   : INR " . number_format($shipping, 2) . "\n";
        $invoiceContent .= "====================================================\n";
        $invoiceContent .= "GRAND TOTAL    : INR " . number_format($grandTotal, 2) . "\n";
        $invoiceContent .= "====================================================\n";
        $invoiceContent .= "Thank you for trading with TATAmart. This is a computer-generated tax invoice.\n";

        $fileName = "{$invoice->invoice_number}.txt";

        // Returns plain text download sheet stream
        return response($invoiceContent, 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ]);
    }

    /**
     * Email computed B2B invoice sheets directly to buyer.
     */
    public function emailInvoice(int $orderId): JsonResponse
    {
        $order = Order::with(['buyer.buyerProfile', 'invoice'])->findOrFail($orderId);
        $invoice = $order->invoice;

        if (!$invoice) {
            return $this->errorResponse('No invoice found for this order. Please pay/checkout first.', 404);
        }

        try {
            $buyerEmail = $order->buyer->email;
            $subtotal = $order->subtotal;
            $cgst = round($subtotal * 0.09, 2);
            $sgst = round($subtotal * 0.09, 2);
            $shipping = $order->shipping_cost > 0 ? $order->shipping_cost : 500.00;
            $grandTotal = $subtotal + $cgst + $sgst + $shipping;

            $items = $order->items->map(function($item) {
                return [
                    'product_name' => $item->product_name_snapshot,
                    'quantity' => $item->quantity,
                    'price' => $item->price_at_purchase,
                    'total' => $item->quantity * $item->price_at_purchase,
                ];
            })->toArray();

            $financials = [
                'subtotal' => $subtotal,
                'cgst' => $cgst,
                'sgst' => $sgst,
                'shipping_cost' => $shipping,
                'grand_total' => $grandTotal,
            ];

            $downloadUrl = url("/api/orders/{$order->id}/invoice/download");

            Mail::send('emails.invoice', [
                'invoiceNumber' => $invoice->invoice_number,
                'orderNumber' => $order->order_number,
                'gstin' => $invoice->gstin,
                'items' => $items,
                'financials' => $financials,
                'downloadUrl' => $downloadUrl
            ], function ($message) use ($buyerEmail, $invoice) {
                $message->to($buyerEmail)
                    ->subject("TATAmart Tax Invoice - {$invoice->invoice_number}");
            });
        } catch (Throwable $e) {
            logger()->error('Invoice email delivery failed: ' . $e->getMessage());
            return $this->errorResponse('Could not email invoice. Please try again.', 500);
        }

        return $this->successResponse([], 'Tax Invoice successfully emailed to your corporate inbox.');
    }
}
