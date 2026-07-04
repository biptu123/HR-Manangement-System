<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasUlids;

    protected $fillable = ['company_id', 'name', 'permissions'];

    protected $casts = [
        'permissions' => 'array',
    ];
}