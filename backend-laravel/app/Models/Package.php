<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $table = 'Package';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = [
        'name',
        'price'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'PackageItem', 'packageId', 'productId')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
