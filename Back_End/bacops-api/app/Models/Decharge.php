<?php
// app/Models/Decharge.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Decharge extends Model
{
    protected $table = 'decharges';

    public $timestamps = false;

protected $fillable = [
    'nom',
    'prenom',
    'cin',
    'telephone',
    'signature_beneficiaire_attachment_id',
    'signature_agent_attachment_id',
    'created_by',
];
    public function signatureBeneficiaire()
    {
        return $this->belongsTo(Attachment::class, 'signature_beneficiaire_attachment_id');
    }

    public function signatureAgent()
    {
        return $this->belongsTo(Attachment::class, 'signature_agent_attachment_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function session()
    {
        return $this->hasOne(InstallationSession::class, 'decharge_id');
    }
}