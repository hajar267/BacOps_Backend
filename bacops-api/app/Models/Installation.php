<?php
// app/Models/Installation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Installation extends Model
{
    protected $table = 'installations';

    public $timestamps = false;

    protected $fillable = [
        'bac_id',
        'rfid_id',
        'installation_session_id',
        'location_lat',
        'location_lng',
        'uninstalled_at',
    ];

    protected $casts = [
        'uninstalled_at' => 'datetime',
    ];

    public function bac()
    {
        return $this->belongsTo(Bac::class, 'bac_id');
    }

    public function rfid()
    {
        return $this->belongsTo(RFID::class, 'rfid_id');
    }

    public function session()
    {
        return $this->belongsTo(InstallationSession::class, 'installation_session_id');
    }
}
