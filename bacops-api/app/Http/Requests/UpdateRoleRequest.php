<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $allPermissions = collect(config('permissions'))->flatten()->push('*')->all();

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:roles,name,' . $this->route('role')->id,
            ],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['string', 'in:' . implode(',', $allPermissions)],
        ];
    }
}
