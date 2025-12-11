<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockMutationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'productId' => 'required|exists:Product,id',
            'type' => 'required|string|in:IN,OUT',
            'condition' => 'required|string',
            'quantity' => 'required|integer',
            'date' => 'required|date',
            'reseller' => 'nullable|string',
            'productionDate' => 'nullable|date',
        ];
    }
}
