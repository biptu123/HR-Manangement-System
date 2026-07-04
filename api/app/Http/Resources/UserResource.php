<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $activeCompany = null;

        // Ensure companies are actually loaded to prevent N+1 query errors
        if ($this->relationLoaded('companies') && $this->companies->isNotEmpty()) {
            
            // 1. If they logged in using user_code, find the matching company
            if ($request->filled('user_code')) {
                $activeCompany = $this->companies->first(function ($company) use ($request) {
                    return $company->pivot->user_code === $request->input('user_code');
                });
            }

            // 2. If logged in by email (no user_code), or if the code didn't match, grab the first one
            if (! $activeCompany) {
                $activeCompany = $this->companies->first();
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'profile_pic_url' => $this->profile_pic_url,
            
            // Return a single CompanyResource object instead of a collection
            'company' => $activeCompany ? new CompanyResource($activeCompany) : null,
            
            'created_at' => $this->created_at,
        ];
    }
}