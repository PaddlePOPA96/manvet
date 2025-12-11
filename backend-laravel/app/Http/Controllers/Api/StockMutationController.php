<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockMutation;

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

        $mutation = StockMutation::create($validated);
        return new \App\Http\Resources\StockMutationResource($mutation->load('product'));
    }
}
