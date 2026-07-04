<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasUlids;

    protected $fillable = ['name', 'domain'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(CompanyUser::class)
            ->withPivot('role_id', 'salary')
            ->withTimestamps();
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }
}