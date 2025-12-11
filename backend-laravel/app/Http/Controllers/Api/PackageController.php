<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Package;
use Illuminate\Support\Facades\DB;

class PackageController extends Controller
{
    public function index()
    {
        $limit = request()->query('limit', 10);
        return \App\Http\Resources\PackageResource::collection(
            Package::with('products')->orderBy('created_at', 'desc')->paginate($limit)
        );
    }

    public function store(\App\Http\Requests\StorePackageRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            $package = Package::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
            ]);

            foreach ($validated['productIds'] as $index => $productId) {
                $quantity = $validated['quantities'][$index] ?? 1;

                $package->products()->attach($productId, ['quantity' => $quantity]);
            }

            return new \App\Http\Resources\PackageResource($package->load('products'));
        });
    }

    public function destroy($id)
    {
        Package::destroy($id);
        return response()->json(['message' => 'Package deleted']);
    }
}
