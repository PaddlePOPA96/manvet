<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $table = 'Promotion';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = [
        'name',
        'startDate',
        'endDate',
        'active'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'PromotionProduct', 'promotionId', 'productId')
            ->withPivot('eventPrice')
            ->withTimestamps();
    }
}
