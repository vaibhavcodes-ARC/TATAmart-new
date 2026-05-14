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
        $rfqs = Rfq::where('buyer_id', Auth::id())
            ->with(['category', 'responses.seller.sellerProfile'])
            ->latest()
            ->get()
            ->map(fn ($rfq) => $this->formatRfq($rfq));

        return $this->successResponse($rfqs);
    }

    // Public board for Sellers to browse open RFQs
    public function marketplace()
    {
        $rfqs = Rfq::where('status', 'open')
            ->with(['category', 'buyer', 'responses' => function ($query) {
                $query->where('seller_id', Auth::id());
            }])
            ->latest()
            ->get()
            ->map(fn ($rfq) => $this->formatRfq($rfq));

        return $this->successResponse($rfqs);
    }

    public function store(Request $request)
    {
        $request->merge([
            'product_name' => $request->input('product_name', $request->input('title')),
            'category_id' => $request->input('category_id', $request->input('categoryId')),
            'expected_price' => $request->input('expected_price', $request->input('targetPrice')),
            'unit' => $request->input('unit', 'units'),
        ]);

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

        return $this->successResponse($rfq, 'RFQ created successfully');
    }

    // Seller responding to RFQ
    public function respond(Request $request, $rfq_id)
    {
        $request->merge([
            'offered_price' => $request->input('offered_price', $request->input('priceQuote')),
            'message' => $request->input('message', $request->input('notes')),
        ]);

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

        return $this->successResponse($response, 'Quote submitted to buyer');
    }

    public function respondFromBody(Request $request)
    {
        $request->validate([
            'rfqId' => 'required|exists:rfqs,id',
        ]);

        return $this->respond($request, $request->rfqId);
    }

    public function selectResponse(int $id)
    {
        $response = RfqResponse::with('rfq')->findOrFail($id);

        if ($response->rfq->buyer_id !== Auth::id()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        RfqResponse::where('rfq_id', $response->rfq_id)->update(['status' => 'rejected']);
        $response->update(['status' => 'accepted']);
        $response->rfq->update(['status' => 'closed']);

        return $this->successResponse($this->formatRfq($response->rfq->fresh(['category', 'responses.seller.sellerProfile'])), 'Quotation accepted successfully');
    }

    private function formatRfq(Rfq $rfq): array
    {
        return [
            'id' => (string) $rfq->id,
            'title' => $rfq->product_name,
            'product_name' => $rfq->product_name,
            'description' => $rfq->description,
            'quantity' => (float) $rfq->quantity,
            'unit' => $rfq->unit,
            'targetPrice' => $rfq->expected_price ? (float) $rfq->expected_price : null,
            'expected_price' => $rfq->expected_price,
            'status' => match ($rfq->status) {
                'open' => $rfq->responses->count() > 0 ? 'RESPONDED' : 'PENDING',
                'closed' => 'CLOSED',
                default => strtoupper($rfq->status),
            },
            'createdAt' => optional($rfq->created_at)->toIso8601String(),
            'category' => $rfq->category ? [
                'id' => (string) $rfq->category->id,
                'name' => $rfq->category->name,
            ] : ['id' => '', 'name' => 'General'],
            'buyer' => $rfq->buyer ? [
                'id' => (string) $rfq->buyer->id,
                'name' => $rfq->buyer->name,
                'email' => $rfq->buyer->email,
            ] : null,
            'responses' => $rfq->responses->map(fn ($response) => [
                'id' => (string) $response->id,
                'sellerId' => (string) $response->seller_id,
                'priceQuote' => (float) $response->offered_price,
                'leadTimeDays' => 5,
                'notes' => $response->message,
                'status' => strtoupper($response->status),
                'createdAt' => optional($response->created_at)->toIso8601String(),
                'seller' => $response->seller ? [
                    'id' => (string) $response->seller->id,
                    'name' => $response->seller->name,
                    'email' => $response->seller->email,
                    'profile' => [
                        'companyName' => $response->seller->sellerProfile?->company_name,
                        'isVerified' => (bool) $response->seller->sellerProfile?->is_verified,
                    ],
                ] : null,
            ])->values(),
        ];
    }
}
