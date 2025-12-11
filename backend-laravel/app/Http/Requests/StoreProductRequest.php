<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'name' => 'required|string',
            'price' => 'required|numeric',
            'cost' => 'required|numeric',
            'photoUrl' => 'nullable|string',
            'packageInfo' => 'nullable|string',
            'categoryId' => 'nullable|integer|exists:Category,id',
            'category' => 'nullable|string', // Support for backward compatibility
            'unit' => 'nullable|string',
        ];
    }
}
