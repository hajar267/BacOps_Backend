<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PreviewPvRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nature' => ['sometimes', 'nullable', 'string'],
            'capacite' => ['sometimes', 'nullable', 'string'],
            'matiere' => ['sometimes', 'nullable', 'string'],
            'startDate' => ['sometimes', 'nullable', 'date'],
            'endDate' => ['sometimes', 'nullable', 'date'],
            'arrond' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
