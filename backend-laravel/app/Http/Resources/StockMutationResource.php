<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMutationResource extends JsonResource
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
            'product' => $this->product ? $this->product->name : null,
            'type' => $this->type === 'IN' ? 'MASUK' : ($this->type === 'OUT' ? 'KELUAR' : $this->type),
            'condition' => $this->condition,
            'quantity' => $this->quantity,
            'date' => $this->date,
            'reseller' => $this->reseller,
            'productionDate' => $this->productionDate,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
