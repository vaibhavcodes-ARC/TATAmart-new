<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
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

        return $this->successResponse($products);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'seller.sellerProfile', 'images', 'reviews.user', 'variants', 'skus'])
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->successResponse($product);
    }

    // Seller action
    public function store(Request $request)
    {
        $request->merge([
            'category_id' => $request->input('category_id', $request->input('categoryId')),
            'name' => $request->input('name', $request->input('title')),
            'short_description' => $request->input('short_description', $request->input('description')),
            'price_min' => $request->input('price_min', $request->input('price')),
            'price_max' => $request->input('price_max', $request->input('price')),
            'min_order_quantity' => $request->input('min_order_quantity', $request->input('moq', 1)),
        ]);

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
        } elseif ($request->filled('images') && is_array($request->images) && count($request->images) > 0) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $request->images[0],
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

        return $this->successResponse($product, 'Product added successfully', 201);
    }

    public function myProducts()
    {
        $products = Product::where('seller_id', Auth::id())->with('primaryImage')->get();
        return $this->successResponse($products);
    }

    public function update(Request $request, int $id)
    {
        $product = Product::where('seller_id', Auth::id())->findOrFail($id);

        $payload = [];
        if ($request->has('title') || $request->has('name')) {
            $payload['name'] = $request->input('name', $request->input('title'));
        }
        if ($request->has('description') || $request->has('short_description')) {
            $payload['short_description'] = $request->input('short_description', $request->input('description'));
        }
        if ($request->has('price') || $request->has('price_min')) {
            $payload['price_min'] = $request->input('price_min', $request->input('price'));
        }
        if ($request->has('moq') || $request->has('min_order_quantity')) {
            $payload['min_order_quantity'] = $request->input('min_order_quantity', $request->input('moq'));
        }

        $product->update($payload);

        return $this->successResponse($product->fresh(['category', 'primaryImage']), 'Product updated successfully');
    }

    public function destroy(int $id)
    {
        $query = Product::query();
        if (! Auth::user()?->isAdmin()) {
            $query->where('seller_id', Auth::id());
        }

        $product = $query->findOrFail($id);
        $product->delete();

        return $this->successResponse([], 'Product removed successfully');
    }

    public function inquire(Request $request)
    {
        $request->merge([
            'product_id' => $request->input('product_id', $request->input('productId')),
        ]);

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'message' => 'required|string|min:3',
            'quantity' => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        $inquiry = Inquiry::create([
            'buyer_id' => Auth::id(),
            'seller_id' => $product->seller_id,
            'product_id' => $product->id,
            'message' => $request->message,
            'quantity' => $request->quantity,
        ]);

        return $this->successResponse($inquiry, 'Inquiry sent successfully', 201);
    }
}
