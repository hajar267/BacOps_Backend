<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateRfidsStockRequest extends FormRequest
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
            'prefix' => ['required', 'string', 'min:1', 'regex:/^[A-Za-z0-9]+$/'],
            'rfid_debut' => ['required', 'integer', 'min:1'],
            'rfid_fin' => ['required', 'integer', 'min:1'],
            'quantite' => ['required', 'integer', 'min:1'],
            'commentaire' => ['sometimes', 'string'],
        ];
    }
}
