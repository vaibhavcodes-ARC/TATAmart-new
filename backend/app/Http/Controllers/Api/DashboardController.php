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
        
        // Aggregate revenue dynamically across associated order line items
        $totalRevenue = \App\Models\OrderItem::where('seller_id', $userId)
            ->sum(\Illuminate\Support\Facades\DB::raw('quantity * price_at_purchase'));
            
        $pendingOrders = \App\Models\OrderItem::where('seller_id', $userId)
            ->whereHas('order', function($q){ $q->where('status', 'pending'); })
            ->count();

        $totalInquiries = Inquiry::where('seller_id', $userId)->count();
        $recentInquiries = Inquiry::where('seller_id', $userId)->with('buyer')->latest()->take(5)->get();
        $totalQuotesSent = RfqResponse::where('seller_id', $userId)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_products' => $totalProducts,
                'total_revenue' => round($totalRevenue, 2),
                'pending_orders' => $pendingOrders,
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
        
        // Aggregate historical procurement spending
        $totalSpent = \App\Models\Order::where('buyer_id', $userId)
            ->where('payment_status', 'paid')
            ->sum('grand_total');

        $recentOrders = \App\Models\Order::where('buyer_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_rfqs' => $totalRfqs,
                'total_spent' => round($totalSpent, 2),
                'recent_orders' => $recentOrders,
                'inquiries_sent' => Inquiry::where('buyer_id', $userId)->count(),
            ]
        ]);
    }
}
