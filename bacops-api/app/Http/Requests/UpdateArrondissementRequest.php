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
            'ville_id' => ['required', 'exists:villes,id'],
            'prefecture_id' => ['nullable', 'exists:prefectures,id'],
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
