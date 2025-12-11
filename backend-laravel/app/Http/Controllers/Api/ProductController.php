<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    public function index()
    {
        $limit = request()->query('limit', 10);
        return \App\Http\Resources\ProductResource::collection(
            Product::with('category')->orderBy('name', 'asc')->paginate($limit)
        );
    }

    public function store(\App\Http\Requests\StoreProductRequest $request)
    {
        $validated = $request->validated();

        // Map camelCase to snake_case for DB
        $data = [
            'name' => $validated['name'],
            'price' => $validated['price'],
            'cost' => $validated['cost'],
            'photo_url' => $validated['photoUrl'] ?? null,
            'package_info' => $validated['packageInfo'] ?? null,
            'categoryId' => $validated['categoryId'] ?? null,
            'unit' => $validated['unit'] ?? null,
        ];

        // Handle backward compatibility for category name
        if (isset($validated['category']) && empty($data['categoryId'])) {
            $category = Category::where('name', $validated['category'])->first();
            if ($category) {
                $data['categoryId'] = $category->id;
            }
        }

        $product = Product::create($data);
        return new \App\Http\Resources\ProductResource($product->load('category'));
    }

    public function update(\App\Http\Requests\UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validated();

        $data = [];
        if (isset($validated['name']))
            $data['name'] = $validated['name'];
        if (isset($validated['price']))
            $data['price'] = $validated['price'];
        if (isset($validated['cost']))
            $data['cost'] = $validated['cost'];
        if (array_key_exists('photoUrl', $validated))
            $data['photo_url'] = $validated['photoUrl'];
        if (array_key_exists('packageInfo', $validated))
            $data['package_info'] = $validated['packageInfo'];
        if (array_key_exists('categoryId', $validated))
            $data['categoryId'] = $validated['categoryId'];
        if (array_key_exists('unit', $validated))
            $data['unit'] = $validated['unit'];

        // Handle backward compatibility for category name
        if (isset($validated['category']) && empty($data['categoryId']) && !isset($validated['categoryId'])) {
            $category = Category::where('name', $validated['category'])->first();
            if ($category) {
                $data['categoryId'] = $category->id;
            }
        }

        $product->update($data);
        return new \App\Http\Resources\ProductResource($product->fresh('category'));
    }

    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(['message' => 'Product deleted']);
    }

    public function adjustStock(Request $request, $id)
    {
        $request->validate([
            'realStock' => 'required|integer|min:0',
            'date' => 'required|date',
            'note' => 'nullable|string'
        ]);

        $product = Product::findOrFail($id);
        $diff = $request->realStock - $product->stock;

        if ($diff == 0) {
            return response()->json(['message' => 'No change in stock', 'data' => $product]);
        }

        // Create Mutation
        $mutation = \App\Models\StockMutation::create([
            'productId' => $product->id,
            'type' => $diff > 0 ? 'IN' : 'OUT',
            'condition' => 'Stock Opname', // Or 'Adjustment'
            'quantity' => abs($diff),
            'date' => $request->date,
            // 'note' => $request->note // If StockMutation has note field? Let's check model later. Use it if exists or ignore.
        ]);

        // Update Product Stock
        $product->stock = $request->realStock;
        $product->save();

        return response()->json([
            'message' => 'Stock adjusted successfully',
            'data' => $product,
            'mutation' => $mutation
        ]);
    }
}
