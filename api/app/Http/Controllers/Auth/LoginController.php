<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function store(LoginRequest $request)
    {
        $loginId = $request->input('id');
        $password = $request->input('password');

        // 1. Determine if the input is an email address
        $isEmail = filter_var($loginId, FILTER_VALIDATE_EMAIL);

        if ($isEmail) {
            // Find by email
            $user = User::where('email', $loginId)->first();
        } else {
            // Find by user_code inside the company_user pivot table
            $user = User::whereHas('companies', function ($query) use ($loginId) {
                $query->where('company_user.user_code', $loginId);
            })->first();

            // Merge the user_code into the request so the UserResource 
            // knows exactly which company to return in the JSON response
            $request->merge(['user_code' => $loginId]);
        }

        // 2. Validate credentials FIRST (Security best practice)
        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'id' => ['The provided credentials are incorrect.'],
            ]);
        }

        // 3. Check if email is verified
        if (! $user->hasVerifiedEmail()) {
            
            // Get the user_code to pass to the Mailable. 
            // If they logged in with email, grab their first company's pivot code.
            // If they logged in with user_code, just use that.
            $userCode = $isEmail 
                ? ($user->companies()->first()->pivot->user_code ?? 'N/A') 
                : $loginId;

            // Send the custom Welcome/Verification email (passing null for password)
            Mail::to($user->email)->send(new WelcomeEmail($user, $userCode, null));

            return response()->json([
                'message' => 'Your email address is not verified. A new verification link has been sent to your email.'
            ], 403);
        }

        // 4. Eager load the companies and pivot data
        $user->load('companies');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
            'message' => 'Login successful'
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}