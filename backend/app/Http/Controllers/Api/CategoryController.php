<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')->with('children')->get();
        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)->with('children', 'products')->firstOrFail();
        return response()->json([
            'status' => 'success',
            'data' => $category
        ]);
    }
    
    public function featured()
    {
        $categories = Category::where('is_featured', true)->take(6)->get();
        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }
}
