<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;
use Illuminate\Support\Facades\DB;

class PromotionController extends Controller
{
    public function index()
    {
        $limit = request()->query('limit', 10);
        return \App\Http\Resources\PromotionResource::collection(
            Promotion::with('products')->orderBy('created_at', 'desc')->paginate($limit)
        );
    }

    public function store(\App\Http\Requests\StorePromotionRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            $promotion = Promotion::create([
                'name' => $validated['name'],
                'startDate' => $validated['startDate'],
                'endDate' => $validated['endDate'],
                'active' => true,
            ]);

            foreach ($validated['productIds'] as $index => $productId) {
                // Ensure eventPrices has corresponding index, fallback to 0 if missing (should validate properly)
                $eventPrice = $validated['eventPrices'][$index] ?? 0;

                $promotion->products()->attach($productId, ['eventPrice' => $eventPrice]);
            }

            return new \App\Http\Resources\PromotionResource($promotion->load('products'));
        });
    }

    public function toggle($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->active = !$promotion->active;
        $promotion->save();

        return $promotion;
    }

    public function destroy($id)
    {
        Promotion::destroy($id);
        return response()->json(['message' => 'Promotion deleted']);
    }
}
