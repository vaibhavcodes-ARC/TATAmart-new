<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Rfq;
use App\Models\RfqResponse;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function sellerStats()
    {
        $userId = Auth::id();
        $totalProducts = Product::where('seller_id', $userId)->count();
        $totalInquiries = Inquiry::where('seller_id', $userId)->count();
        $recentInquiries = Inquiry::where('seller_id', $userId)->with('buyer')->latest()->take(5)->get();
        $totalQuotesSent = RfqResponse::where('seller_id', $userId)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_products' => $totalProducts,
                'total_inquiries' => $totalInquiries,
                'quotes_sent' => $totalQuotesSent,
                'recent_inquiries' => $recentInquiries
            ]
        ]);
    }

    public function buyerStats()
    {
        $userId = Auth::id();
        $totalRfqs = Rfq::where('buyer_id', $userId)->count();
        $activeRfqs = Rfq::where('buyer_id', $userId)->where('status', 'open')->count();
        
        // Count inquiries made
        $sentInquiries = Inquiry::where('buyer_id', $userId)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_rfqs' => $totalRfqs,
                'active_rfqs' => $activeRfqs,
                'inquiries_sent' => $sentInquiries,
            ]
        ]);
    }
}
