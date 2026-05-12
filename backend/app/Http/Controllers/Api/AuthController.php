<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BuyerProfile;
use App\Models\SellerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Throwable;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Normalize input
        $request->merge([
            'role' => strtolower($request->role ?? ''),
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:buyer,seller',
            'company_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Create profile automatically based on role
        if ($user->role === 'seller') {
            SellerProfile::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name ?? ($request->name . ' Enterprises'),
            ]);
        } else {
            BuyerProfile::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name ?? '',
            ]);
        }

        try {
            $token = JWTAuth::fromUser($user);
        } catch (Throwable $exception) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication service is not configured. Please set JWT_SECRET.',
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'token' => $token,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        
        $credentials = $request->only('email', 'password');

        try {
            $token = Auth::attempt($credentials);
        } catch (Throwable $exception) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication service is unavailable. Please verify JWT_SECRET and database connectivity.',
            ], 500);
        }
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        if (! $user->is_active) {
            Auth::logout();
            return response()->json([
                'status' => 'error',
                'message' => 'This account is disabled. Please contact support.',
            ], 403);
        }
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function me()
    {
        $user = Auth::user();
        if ($user->role === 'seller') {
            $user->load('sellerProfile');
        } else if ($user->role === 'buyer') {
            $user->load('buyerProfile');
        }
        return response()->json([
            'status' => 'success',
            'user' => $user,
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorization' => [
                'token' => JWTAuth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }
}
