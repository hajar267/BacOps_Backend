<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCadreCommandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => [
                'sometimes', 'required', 'string', 'min:1',
                'unique:cadre_commande,label,' . $this->route('cadreCommande')?->id,
            ],
        ];
    }
}
