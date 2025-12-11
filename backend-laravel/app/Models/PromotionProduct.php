<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionProduct extends Model
{
    protected $table = 'PromotionProduct';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = [
        'promotionId',
        'productId',
        'eventPrice'
    ];
}
