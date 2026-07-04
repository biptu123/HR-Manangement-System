<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisterCompanyController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($request) {
            // 1. Create the Company
            $company = Company::create([
                'name' => $request->company_name,
            ]);

            // 2. Create default roles for this company
            $adminRole = $company->roles()->create(['name' => 'ADMIN']);
            $company->roles()->create(['name' => 'EMPLOYEE']);

            // 3. Create the Admin User
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // 4. Link User to Company as Admin
            $company->users()->attach($user->id, [
                'id' => \Illuminate\Support\Str::ulid(), // Pivot needs an ID
                'role_id' => $adminRole->id
            ]);

            return $user;
        });

        // 5. Generate Sanctum Token for immediate login
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Company and Admin registered successfully'
        ], 201);
    }
}