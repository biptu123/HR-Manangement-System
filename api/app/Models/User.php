<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUlids;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'profile_pic_url',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class)
            ->using(CompanyUser::class)
            ->withPivot('role_id','user_code')
            ->withTimestamps();
    }

   public function isAdminOf(Company $company)
    {
        // 1. Get the ID of the 'ADMIN' role for this specific company
        $adminRoleId = $company->roles()->where('name', 'ADMIN')->value('id');

        // 2. Check if this user is attached to this company with that role
        return $this->companies()
            ->where('company_id', $company->id)
            ->wherePivot('role_id', $adminRoleId)
            ->exists();
    }
}
