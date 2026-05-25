<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // GET /api/menu — full menu tree: categories -> subcategories -> products
    public function index()
    {
        $categories = Category::with('subcategories.products')->get();

        return $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'image' => $this->url($category->image),
                'subcategories' => $category->subcategories->map(function ($subcategory) {
                    return [
                        'id' => $subcategory->id,
                        'name' => $subcategory->name,
                        'products' => $subcategory->products->map(function ($product) {
                            return [
                                'id' => $product->id,
                                'name' => $product->name,
                                'description' => $product->description,
                                'price' => $product->price,
                                'image' => $this->url($product->image),
                            ];
                        }),
                    ];
                }),
            ];
        });
    }

    private function url(?string $path): ?string
    {
        // Absolute URL so the frontend (different origin) can load the image.
        return $path ? url(Storage::disk('public')->url($path)) : null;
    }
}