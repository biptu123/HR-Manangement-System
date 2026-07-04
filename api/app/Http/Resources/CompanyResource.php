<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'domain' => $this->domain,
            'logo_url' => $this->logo_url,
            // Only include pivot data if it was actually loaded
            'employment_details' => $this->whenPivotLoaded('company_user', function () {
                return [
                    'role_id' => $this->pivot->role_id,
                    'user_code' => $this->pivot->user_code,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}