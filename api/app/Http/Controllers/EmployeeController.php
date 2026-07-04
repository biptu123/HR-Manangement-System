<?php


namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\StoreEmployeeRequest;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $company = $user->companies()->first(); // Assuming you've set the active company

        // If ADMIN, return all company employees. If EMPLOYEE, return only self.
        $employees = $user->isAdminOf($company) 
            ? UserResource::collection($company->users) 
            : new UserResource($user);

        return response()->json($employees);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $admin = $request->user();
        $company = $admin->companies()->first();

        // 1. Generate auto-password
        $rawPassword = Str::password(12);

        // 2. Create User
        $employee = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($rawPassword),
        ]);

        // 3. Attach to company with EMPLOYEE role
        $employeeRole = $company->roles()->where('name', 'EMPLOYEE')->first();
        $userCode = $company->generateUserCode($employee);
        $company->users()->attach($employee->id, [
            'id' => Str::ulid(),
            'role_id' => $employeeRole->id,
            'user_code' => $userCode,
        ]);

        // 4. Send email (Make sure your Mailable class is set up)
        
        Mail::to($employee->email)->send(new WelcomeEmail($employee, $userCode, $rawPassword));

        return response()->json(['message' => 'Employee added successfully', 'employee' => $employee], 201);
    }
}