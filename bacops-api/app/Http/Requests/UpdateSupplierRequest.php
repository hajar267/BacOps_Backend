<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'  => ['sometimes', 'required', 'string', 'min:1'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
        ];
    }
}
