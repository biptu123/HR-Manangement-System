<?php
namespace App\Models;

use DB;
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
            ->withPivot('role_id', 'user_code')
            ->withTimestamps();
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }
    public function generateUserCode(User $user): string
    {
        $year = now()->format('Y');

        //* Company Initials (e.g., "Test Company" -> "TC", "Acme" -> "A")
        $companyInitials = collect(explode(' ', trim($this->name)))
            ->map(fn($word) => strtoupper(substr($word, 0, 1)))
            ->implode('');

        //* User Initials (e.g., "Biptu Das" -> "BIDA")
        $nameParts = explode(' ', trim($user->name));
        $firstName = $nameParts[0];
        //* Fallback to first name if they didn't provide a last name
        $lastName = count($nameParts) > 1 ? end($nameParts) : 'XX'; 

        //* Ensure exactly 2 characters (pads with 'X' if a name is too short, like "Al")
        $first2 = str_pad(strtoupper(substr($firstName, 0, 2)), 2, 'X');
        $last2 = str_pad(strtoupper(substr($lastName, 0, 2)), 2, 'X');

        //* Serial Number for the current year
        $countThisYear = DB::table('company_user')
            ->where('company_id', $this->id)
            ->whereYear('created_at', $year)
            ->count();
            
        //* Pads the number with zeros (e.g., 1 -> 0001)
        $serial = str_pad($countThisYear + 1, 4, '0', STR_PAD_LEFT);

        return "{$companyInitials}{$first2}{$last2}{$year}{$serial}";
    }
}