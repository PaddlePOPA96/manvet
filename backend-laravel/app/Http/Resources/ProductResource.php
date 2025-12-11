<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'price' => $this->price,
            'cost' => $this->cost,
            'photoUrl' => $this->photo_url,
            'packageInfo' => $this->package_info,
            'categoryId' => $this->categoryId,
            'unit' => $this->unit,
            'stock' => $this->stock,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
