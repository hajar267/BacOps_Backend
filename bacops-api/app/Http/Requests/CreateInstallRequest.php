<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateInstallRequest extends FormRequest
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
            'installation' => ['required', 'array'],

            'installation.siteInfo' => ['required', 'array'],
            'installation.siteInfo.nature' => ['required', 'string', 'min:1'],
            'installation.siteInfo.capacite' => ['required', 'string', 'min:1'],
            'installation.siteInfo.matiere' => ['required', 'string', 'min:1'],
            'installation.siteInfo.color' => ['required', 'string', 'min:1'],
            'installation.siteInfo.variante' => ['sometimes', 'string', 'min:1'],
            'installation.siteInfo.allowedBacTypeIds' => ['sometimes', 'array'],
            'installation.siteInfo.allowedBacTypeIds.*' => ['integer'],

            'installation.bacs' => ['required', 'array', 'min:1'],
            'installation.bacs.*.bacSerie' => ['required', 'string', 'min:1'],
            'installation.bacs.*.rfidSerie' => ['required', 'string', 'min:1'],

            'installation.location' => ['sometimes', 'array'],
            'installation.location.arrondissement_id' => ['required_with:installation.location', 'integer', 'exists:arrondissements,id'],
            'installation.location.address' => ['required_with:installation.location', 'string', 'min:1'],
            'installation.location.pointDeRegroupement' => ['sometimes', 'nullable', 'string'],

            'installation.beneficiary' => ['sometimes', 'array'],
            'installation.beneficiary.nom' => ['required_with:installation.beneficiary', 'string', 'min:1'],
            'installation.beneficiary.prenom' => ['required_with:installation.beneficiary', 'string', 'min:1'],
            'installation.beneficiary.cin' => ['required_with:installation.beneficiary', 'string', 'min:1'],
            'installation.beneficiary.telephone' => ['required_with:installation.beneficiary', 'string', 'min:1'],
            'installation.beneficiary.isFilled' => ['sometimes', 'boolean'],
            'installation.beneficiary.signature1' => ['required_if:installation.beneficiary.isFilled,true', 'string'],
            'installation.beneficiary.signature2' => ['required_if:installation.beneficiary.isFilled,true', 'string'],
            'installation.photo' => ['sometimes', 'nullable', 'string'],
            'installation.localisation' => ['sometimes', 'nullable', 'string'],
            'installation.installedAt' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
