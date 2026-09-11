<?php

// app/Models/InstallationSession.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'arrondissement_id',
        'installed_at',
        'decharge_id',
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

    public function arrondissement(): BelongsTo
    {
        return $this->belongsTo(Arrondissement::class);
    }

    public function decharge(): BelongsTo
    {
        return $this->belongsTo(Decharge::class);
    }
}
