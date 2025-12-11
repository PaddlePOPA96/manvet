<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\Package;

class TransactionItem extends Model
{
    protected $table = 'TransactionItem';
    public $timestamps = false;
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null; // Disable update timestamp
    protected $fillable = [
        'transactionId',
        'productId',
        'packageId',
        'type',
        'qty',
        'basePrice',
        'price',
        'cost',
        'discountPerUnit'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transactionId');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

    public function package()
    {
        return $this->belongsTo(Package::class, 'packageId');
    }
}
