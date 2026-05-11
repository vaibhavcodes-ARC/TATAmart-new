<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rfq;
use App\Models\RfqResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RfqController extends Controller
{
    // Buyer lists their own RFQs
    public function index()
    {
        $rfqs = Rfq::where('buyer_id', Auth::id())->with('category', 'responses')->get();
        return response()->json(['status' => 'success', 'data' => $rfqs]);
    }

    // Public board for Sellers to browse open RFQs
    public function marketplace()
    {
        $rfqs = Rfq::where('status', 'open')->with('category')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $rfqs]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'required',
            'quantity' => 'required|numeric',
            'unit' => 'required',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $rfq = Rfq::create([
            'buyer_id' => Auth::id(),
            'product_name' => $request->product_name,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'quantity' => $request->quantity,
            'unit' => $request->unit,
            'expected_price' => $request->expected_price,
            'status' => 'open'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'RFQ created successfully',
            'data' => $rfq
        ]);
    }

    // Seller responding to RFQ
    public function respond(Request $request, $rfq_id)
    {
        $request->validate([
            'offered_price' => 'required|numeric',
            'message' => 'nullable|string',
        ]);

        $response = RfqResponse::create([
            'rfq_id' => $rfq_id,
            'seller_id' => Auth::id(),
            'offered_price' => $request->offered_price,
            'message' => $request->message,
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Quote submitted to buyer',
            'data' => $response
        ]);
    }
}
