<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'Product';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = [
        'name',
        'price',
        'cost',
        'photo_url',
        'package_info',
        'categoryId',
        'unit',
        'stock'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

    public function stockMutations()
    {
        return $this->hasMany(StockMutation::class, 'productId');
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class, 'productId');
    }

    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'PromotionProduct', 'productId', 'promotionId')
            ->withPivot('eventPrice')
            ->withTimestamps();
    }

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'PackageItem', 'productId', 'packageId')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
