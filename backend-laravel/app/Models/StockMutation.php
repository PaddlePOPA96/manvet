<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMutation extends Model
{
    protected $table = 'StockMutation';
    public $timestamps = false;
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null; // Disable update timestamp
    protected $fillable = [
        'productId',
        'type',
        'condition',
        'quantity',
        'date',
        'reseller',
        'productionDate',
    ];

    protected $casts = [
        'date' => 'datetime',
        'productionDate' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:s.u\Z');
    }
}
