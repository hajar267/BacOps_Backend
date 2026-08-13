<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateBacsStockRequest extends FormRequest
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
        'numero_debut' => ['required', 'integer', 'min:1'],
        'numero_fin' => ['required', 'integer', 'min:1'],
        'nature' => ['required', 'string', 'min:1'],
        'capacite' => ['required', 'string', 'min:1'],
        'matiere' => ['required', 'string', 'min:1'],
        'color' => ['required', 'string', 'min:1'],
        'cadre_commande_id' => ['required', 'integer', 'exists:cadre_commande,id'],
        'quantite' => ['required', 'integer', 'min:1'],
        'prix' => ['required', 'numeric', 'gt:0'],
        'fournisseur_id' => ['required', 'integer', 'exists:suppliers,id'],
        'commentaire' => ['sometimes', 'string'],
    ];
}
}
