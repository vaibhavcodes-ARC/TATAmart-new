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

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:buyer,seller',
            'company_name' => 'nullable|string|max:255',
        ]);

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
            return $this->errorResponse('Authentication service is not configured. Please set JWT_SECRET.', 500);
        }

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ], 'User created successfully');
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
            return $this->errorResponse('Authentication service is unavailable. Please verify JWT_SECRET and database connectivity.', 500);
        }
        
        if (!$token) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $user = Auth::user();
        if (! $user->is_active) {
            Auth::logout();
            return $this->errorResponse('This account is disabled. Please contact support.', 403);
        }
        
        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ], 'Successfully logged in');
    }

    public function logout()
    {
        Auth::logout();
        return $this->successResponse([], 'Successfully logged out');
    }

    public function me()
    {
        $user = Auth::user();
        if ($user->role === 'seller') {
            $user->load('sellerProfile');
        } else if ($user->role === 'buyer') {
            $user->load('buyerProfile');
        }
        return $this->successResponse([
            'user' => $user,
        ], 'User retrieved successfully');
    }

    public function refresh()
    {
        return $this->successResponse([
            'user' => Auth::user(),
            'authorization' => [
                'token' => JWTAuth::refresh(),
                'type' => 'bearer',
            ]
        ], 'Token refreshed successfully');
    }
}
