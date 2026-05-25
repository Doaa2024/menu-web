<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    public function index()
    {
        return Subcategory::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'name' => 'required|string|max:255'
        ]);

        $subcategory = Subcategory::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory created successfully',
            'data' => $subcategory
        ], 201);
    }

    public function show(string $id)
    {
        return Subcategory::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $subcategory = Subcategory::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'name' => 'sometimes|required|string|max:255'
        ]);

        $subcategory->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory updated successfully',
            'data' => $subcategory
        ]);
    }

   public function destroy(string $id)
{
    $subcategory = Subcategory::findOrFail($id);

    $subcategory->delete();

    return response()->json([
        'message' => 'Subcategory deleted successfully'
    ]);
}
}