<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArrondissementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prefecture' => 'sometimes|required|string|max:255',
            'ville' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|required|string|max:255',
        ];
    }
}
