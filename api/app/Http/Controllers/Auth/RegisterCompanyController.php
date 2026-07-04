<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterCompanyRequest;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisterCompanyController extends Controller
{
    public function store(RegisterCompanyRequest $request)
    {

        $user = DB::transaction(function () use ($request) {
            // * Create the Company
            $company = Company::create([
                'name' => $request->company_name,
                'logo_url' => $request->logo_url,
            ]);

            // * Create default roles for this company
            $adminRole = $company->roles()->create(['name' => 'ADMIN']);
            $company->roles()->create(['name' => 'EMPLOYEE']);

            // * Create the Admin User
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            $userCode = $company->generateUserCode($user);

            // * Link User to Company as Admin
            $company->users()->attach($user->id, [
                'id' => \Illuminate\Support\Str::ulid(), // Pivot needs an ID
                'role_id' => $adminRole->id,
                'user_code' => $userCode,
            ]);

            return $user;
        });


        return response()->json([
            'message' => 'Company and Admin registered successfully'
        ], 201);
    }
}