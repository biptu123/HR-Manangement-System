<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use HasUlids;

    // Ensure Eloquent knows this model uses string IDs, not integers
    public $incrementing = false;
    protected $keyType = 'string';
}