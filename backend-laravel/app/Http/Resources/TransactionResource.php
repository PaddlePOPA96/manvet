<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'userId' => $this->userId,
            'date' => $this->date,
            'totalAmount' => $this->totalAmount,
            'items' => TransactionItemResource::collection($this->whenLoaded('items')),
            'type' => 'KELUAR', // For consistency
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
