<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PV extends Model
{
    protected $table = 'pvs';

    const UPDATED_AT = null;

    protected $fillable = [
        'admin_id',
        'contract_num',
        'pv_number',
        'start_date',
        'end_date',
        'filter_capacite',
        'filter_matiere',
        'signed_pdf_url',
        'signed_at',
        'created_at',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'signed_at' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}