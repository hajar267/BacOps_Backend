<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockSummaryBac extends Model
{
    protected $table = 'stock_summary_bac';

    const CREATED_AT = null;
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'bac_type_id',
        'total',
        'en_stock',
        'en_service',
        'en_reparation',
        'perdu',
        'mis_en_rebut',
    ];

    protected $casts = [
        'total' => 'integer',
        'en_stock' => 'integer',
        'en_service' => 'integer',
        'en_reparation' => 'integer',
        'perdu' => 'integer',
        'mis_en_rebut' => 'integer',
    ];

    public function bacType()
    {
        return $this->belongsTo(BacType::class, 'bac_type_id');
    }
}
