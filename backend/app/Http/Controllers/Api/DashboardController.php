<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Rfq;
use App\Models\RfqResponse;
use App\Models\Inquiry;
use App\Models\Order;
use App\Models\User;
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

    public function sellerAnalytics()
    {
        $userId = Auth::id();
        $rfqs = Rfq::whereHas('responses', fn ($query) => $query->where('seller_id', $userId));
        $totalLeads = Rfq::where('status', 'open')->count();
        $quotesSent = RfqResponse::where('seller_id', $userId)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'totalLeads' => $totalLeads,
                'responseRate' => $totalLeads > 0 ? round(($quotesSent / $totalLeads) * 100) : 0,
                'statusCounts' => [
                    'PENDING' => Rfq::where('status', 'open')->count(),
                    'REPLIED' => (clone $rfqs)->count(),
                    'CLOSED' => Rfq::where('status', 'closed')->count(),
                ],
                'topProducts' => Product::where('seller_id', $userId)
                    ->withCount('images')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(fn ($product) => [
                        'id' => (string) $product->id,
                        'title' => $product->name,
                        'inquiries_count' => Inquiry::where('product_id', $product->id)->count(),
                    ]),
                'monthlyLeads' => [],
            ],
        ]);
    }

    public function adminStats()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalProducts' => Product::count(),
            'totalInquiries' => Inquiry::count(),
            'totalOrders' => Order::count(),
        ]);
    }

    public function adminUsers()
    {
        $users = User::with(['sellerProfile', 'buyerProfile'])->latest()->get()->map(function ($user) {
            $profile = $user->sellerProfile ?: $user->buyerProfile;

            return [
                'id' => (string) $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'role' => strtoupper($user->role),
                'createdAt' => optional($user->created_at)->toIso8601String(),
                'profile' => $profile ? [
                    'companyName' => $profile->company_name ?? '',
                    'gstNumber' => $profile->gst_number ?? '',
                    'city' => $profile->city ?? '',
                    'isVerified' => (bool) ($profile->is_verified ?? false),
                ] : null,
            ];
        });

        return response()->json($users);
    }

    public function adminProducts()
    {
        $products = Product::with(['category', 'seller'])->latest()->get()->map(fn ($product) => [
            'id' => (string) $product->id,
            'title' => $product->name,
            'price' => (float) $product->price_min,
            'categoryId' => $product->category?->name ?? '',
            'seller' => [
                'name' => $product->seller?->name ?? 'Unknown',
                'email' => $product->seller?->email ?? '',
            ],
        ]);

        return response()->json($products);
    }

    public function toggleUserVerification(Request $request, int $id)
    {
        $user = User::with('sellerProfile')->findOrFail($id);

        if (! $user->sellerProfile) {
            return response()->json(['message' => 'Seller profile not found'], 404);
        }

        $request->validate(['isVerified' => 'required|boolean']);
        $user->sellerProfile->update(['is_verified' => $request->boolean('isVerified')]);

        return response()->json([
            'status' => 'success',
            'message' => 'Verification status updated',
        ]);
    }
}
