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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Throwable;

class AuthController extends Controller
{
    /**
     * Handle corporate user registration including phone validation and secure email OTP dispatch.
     */
    public function register(Request $request)
    {
        // Normalize role string to lowercase for database consistency
        $request->merge([
            'role' => strtolower($request->role ?? ''),
        ]);

        // Validate corporate user input parameters including phone number and country code
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:buyer,seller',
            'company_name' => 'nullable|string|max:255',
            'phone_number' => 'required|string|min:5|max:15',
            'phone_country_code' => 'required|string|max:10',
        ]);

        // Generate a cryptographically secure 6-digit verification code
        $otpCode = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        // Expiry window is set to 30 minutes from creation
        $otpExpiry = Carbon::now()->addMinutes(30);

        // Create the core User record
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_number' => $request->phone_number,
            'phone_country_code' => $request->phone_country_code,
            'email_verification_code' => $otpCode,
            'email_verification_expiry' => $otpExpiry,
        ]);

        // Automatically map and provision corresponding profile tables based on corporate role
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

        // Fire verification email using log-based system
        try {
            Mail::send('emails.verification-otp', ['name' => $user->name, 'otpCode' => $otpCode], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Verify Your TATAmart Account');
            });
        } catch (Throwable $e) {
            // Log fallback if mail service fails, preventing registration crashes
            logger()->error('Verification OTP Email delivery failed: ' . $e->getMessage());
        }

        // Issue JWT bearer token for the newly created session
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

    /**
     * Generate secure token and email a password recovery link to the user.
     */
    public function forgotPassword(Request $request)
    {
        // Validate presence of registered corporate email
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        // Generate a highly secure random token
        $token = Str::random(64);

        // Delete any existing tokens for this email to prevent spam/duplicate vectors
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Insert fresh reset token entry with timestamp
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        // Construct frontend recovery URL
        $resetUrl = "http://127.0.0.1:3000/auth/reset-password?token={$token}&email=" . urlencode($request->email);

        // Dispatches standard text email through the logs channel
        try {
            Mail::send('emails.reset-password', ['resetUrl' => $resetUrl], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('TATAmart Password Reset Request');
            });
        } catch (Throwable $e) {
            logger()->error('Forgot password email dispatch failed: ' . $e->getMessage());
        }

        return $this->successResponse([], 'Secure password reset link has been dispatched to your corporate inbox.');
    }

    /**
     * Verify recovery token expiry and update the user's password.
     */
    public function resetPassword(Request $request)
    {
        // Validate password and verification elements
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:6'
        ]);

        // Find the valid token record
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        // Halt if token does not match
        if (!$record) {
            return $this->errorResponse('Invalid or unauthorized recovery token.', 422);
        }

        // Halt if token is older than 15 minutes
        $expiryTime = Carbon::parse($record->created_at)->addMinutes(15);
        if (Carbon::now()->gt($expiryTime)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return $this->errorResponse('Recovery token has expired. Please initiate forgot password again.', 422);
        }

        // Retrieve corresponding user and update password securely
        $user = User::where('email', $request->email)->firstOrFail();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Purge token records for security hygiene
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return $this->successResponse([], 'Your password has been successfully updated.');
    }

    /**
     * Verify the 6-digit corporate verification OTP.
     */
    public function verifyEmail(Request $request)
    {
        // Validate the OTP payload format
        $request->validate([
            'code' => 'required|string|size:6'
        ]);

        $user = Auth::user();

        // Check if user is already verified
        if ($user->email_verified_at) {
            return $this->successResponse([], 'Your email address is already verified.');
        }

        // Validate correct OTP code match
        if ($user->email_verification_code !== $request->code) {
            return $this->errorResponse('Incorrect verification code. Please check your entries.', 422);
        }

        // Verify that the code has not expired
        if (Carbon::now()->gt(Carbon::parse($user->email_verification_expiry))) {
            return $this->errorResponse('Verification code has expired. Please request a new code.', 422);
        }

        // Complete the verification process atomically
        $user->update([
            'email_verified_at' => Carbon::now(),
            'email_verification_code' => null,
            'email_verification_expiry' => null
        ]);

        return $this->successResponse([
            'user' => $user->fresh()
        ], 'Email address successfully verified. Welcome to TATAmart Workspace!');
    }

    /**
     * Generate and dispatch a fresh OTP for verification.
     */
    public function resendVerification(Request $request)
    {
        $user = Auth::user();

        // Cancel if already verified
        if ($user->email_verified_at) {
            return $this->successResponse([], 'Your email address is already verified.');
        }

        // Generate a new cryptographically secure OTP
        $newOtp = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $newExpiry = Carbon::now()->addMinutes(30);

        // Save new code and expiry
        $user->update([
            'email_verification_code' => $newOtp,
            'email_verification_expiry' => $newExpiry
        ]);

        // Send out the new verification code email
        try {
            Mail::send('emails.verification-otp', ['name' => $user->name, 'otpCode' => $newOtp], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Verify Your TATAmart Account');
            });
        } catch (Throwable $e) {
            logger()->error('Verification OTP Resend delivery failed: ' . $e->getMessage());
        }

        return $this->successResponse([], 'A fresh verification OTP has been dispatched to your corporate inbox.');
    }
}
