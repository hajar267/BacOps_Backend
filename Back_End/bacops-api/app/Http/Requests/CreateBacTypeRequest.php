<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateBacTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization logic can be added also here instead of midleware, but for more organized code we handle it in midleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nature'   => ['required', 'string', 'min:1'],
            'capacite' => ['present', 'nullable', 'string', 'min:1'],
            'variante' => ['sometimes', 'nullable', 'string', 'min:1'],
            'matiere'  => ['present', 'nullable', 'string', 'min:1'],
            'color'    => ['present', 'nullable', 'string', 'min:1'],
        ];
    }
}
