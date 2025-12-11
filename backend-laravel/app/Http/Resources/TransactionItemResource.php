<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->productId,
            'packageId' => $this->packageId,
            'type' => $this->type,
            'qty' => $this->qty,
            'price' => $this->price,
            'cost' => $this->cost,
            'discountPerUnit' => $this->discountPerUnit,
            'product' => new ProductResource($this->whenLoaded('product')),
            'package' => new PackageResource($this->whenLoaded('package')),
        ];
    }
}
