<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'seller.sellerProfile', 'primaryImage', 'variants', 'skus'])->active();

        // Apply filters
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('short_description', 'LIKE', "%{$search}%");
            });
        }

        if ($request->has('min_price')) {
            $query->where('price_min', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price_max', '<=', $request->max_price);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'seller.sellerProfile', 'images', 'reviews.user', 'variants', 'skus'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    // Seller action
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'short_description' => 'required',
            'price_min' => 'nullable|numeric',
            'price_max' => 'nullable|numeric',
            'images' => 'nullable|array'
        ]);

        $product = Product::create([
            'seller_id' => Auth::id(),
            'category_id' => $request->category_id,
            'name' => $request->name,
            'short_description' => $request->short_description,
            'long_description' => $request->long_description,
            'model_number' => $request->model_number,
            'min_order_quantity' => $request->min_order_quantity ?? 1,
            'unit' => $request->unit ?? 'pieces',
            'price_min' => $request->price_min,
            'price_max' => $request->price_max,
            'currency' => $request->currency ?? 'INR',
        ]);

        // Handle mock images creation if uploaded
        if($request->has('image_url')){
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $request->image_url,
                'is_primary' => true
            ]);
        } else {
            // Default placeholder
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => 'https://via.placeholder.com/300?text='.urlencode($product->name),
                'is_primary' => true
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Product added successfully',
            'data' => $product
        ], 201);
    }

    public function myProducts()
    {
        $products = Product::where('seller_id', Auth::id())->with('primaryImage')->get();
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}
