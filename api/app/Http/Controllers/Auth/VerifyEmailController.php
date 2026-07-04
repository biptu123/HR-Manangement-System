<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request; // <-- Make sure it is EXACTLY this import

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, string $id, string $hash)
    {
        // 1. Manually find the user by the ID passed in the URL
        $user = User::findOrFail($id);

        // 2. Verify the hash. Notice we use $user here, NOT $request->user()
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Invalid or expired verification link.');
        }

        // 3. Check if already verified. Notice we use $user, NOT $request->user()
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Email is already verified.'
            ]);
        }

        // 4. Mark as verified. Notice we use $user, NOT $request->user()
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Email successfully verified.'
        ]);
    }
}