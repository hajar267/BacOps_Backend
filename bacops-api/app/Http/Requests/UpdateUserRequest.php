<?php

// app/Http/Requests/UpdateUserRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is handled by your route middleware
    }

    public function rules(): array
    {
        // $this->route('user') grabs the ID from the URL (e.g. /users/{user})
        $userId = $this->route('user');

        return [
            'firstName' => 'sometimes|required|string|max:255',
            'lastName'  => 'sometimes|required|string|max:255',
            'email'     => 'sometimes|required|email|max:255|unique:users,email,' . $userId,
            'roleName'  => 'sometimes|required|string|exists:roles,name',
            'active'    => 'sometimes|boolean',
        ];
    }
}
