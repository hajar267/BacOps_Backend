<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArrondissementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prefecture' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'name' => 'required|string|max:255',
        ];
    }
}
