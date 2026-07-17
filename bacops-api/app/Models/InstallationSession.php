<?php
// app/Models/InstallationSession.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstallationSession extends Model
{
    protected $table = 'installation_sessions';

    public $timestamps = false;

    protected $fillable = [
        'agent_id',
        'num_point',
        'location_lat',
        'location_lng',
        'address',
        'arrond',
        'installed_at',
    ];

    protected $casts = [
        'installed_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function installations()
    {
        return $this->hasMany(Installation::class, 'installation_session_id');
    }
}
