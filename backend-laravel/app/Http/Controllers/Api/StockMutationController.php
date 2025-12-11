<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockMutation;
use Illuminate\Support\Facades\DB;

class StockMutationController extends Controller
{
    public function index()
    {
        $limit = request()->query('limit', 10);
        return \App\Http\Resources\StockMutationResource::collection(
            StockMutation::with('product')->orderBy('date', 'desc')->paginate($limit)
        );
    }

    public function store(\App\Http\Requests\StoreStockMutationRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // Create stock mutation
            $mutation = StockMutation::create($validated);
            
            // Update product stock
            $product = \App\Models\Product::find($validated['productId']);
            if ($product) {
                if ($validated['type'] === 'IN') {
                    $product->increment('stock', $validated['quantity']);
                } elseif ($validated['type'] === 'OUT') {
                    $product->decrement('stock', $validated['quantity']);
                }
            }
            
            return new \App\Http\Resources\StockMutationResource($mutation->load('product'));
        });
    }
}
