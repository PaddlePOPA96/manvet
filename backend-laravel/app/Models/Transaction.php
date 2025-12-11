<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'Transaction';
    public $timestamps = false;
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null; // Disable update timestamp
    protected $fillable = [
        'userId',
        'date',
        'totalAmount'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:s.u\Z');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'transactionId');
    }
}
