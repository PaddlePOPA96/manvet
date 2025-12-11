<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $limit = request()->query('limit', 10);
        return \App\Http\Resources\CategoryResource::collection(
            Category::orderBy('name', 'asc')->paginate($limit)
        );
    }

    public function store(\App\Http\Requests\StoreCategoryRequest $request)
    {
        $validated = $request->validated();

        return new \App\Http\Resources\CategoryResource(Category::create($validated));
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Category deleted']);
    }
}
