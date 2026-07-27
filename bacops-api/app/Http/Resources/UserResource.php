<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'isActive' => $this->is_active,
            'role' => $this->role ? [
                'id' => $this->role->id,
                'name' => $this->role->name,
                'permissions' => $this->role->permissions ?? [],
            ] : null,
            'createdAt' => $this->created_at,
        ];
    }
}