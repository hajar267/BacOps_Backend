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
            'rfids' => ['required', 'array', 'min:1', 'max:' . config('stock.max_rfid_items')],
            'rfids.*' => ['required', 'string', 'min:1', 'regex:/^[0-9A-Fa-f]+$/'],
            'commentaire' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
