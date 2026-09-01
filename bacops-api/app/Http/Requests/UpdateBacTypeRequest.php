<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class UpdateBacTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nature'   => ['sometimes', 'required', 'string', 'min:1'],
            'capacite' => ['sometimes', 'present', 'nullable', 'string', 'min:1'],
            'variante' => ['sometimes', 'nullable', 'string', 'min:1'],
            'matiere'  => ['sometimes', 'present', 'nullable', 'string', 'min:1'],
            'color'    => ['sometimes', 'present', 'nullable', 'string', 'min:1'],
        ];
    }
}