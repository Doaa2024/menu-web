<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    // GET ALL
    public function index()
    {
        return Restaurant::all();
    }

    // UPDATE
    public function update(Request $request, string $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:restaurants,name,' . $id,
            'address' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20|regex:/^[0-9+\-\s()]+$/',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'instagram' => 'nullable|url|max:500',
            'whatsapp' => 'nullable|url|max:500'
        ]);
        if ($request->hasFile('logo')) {
    $path = $request->file('logo')->store('restaurants', 'public');
    $validated['logo'] = $path;
}
        if ($request->hasFile('cover_image')) {
    $path = $request->file('cover_image')->store('restaurants', 'public');
    $validated['cover_image'] = $path;
}

        $restaurant->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Restaurant updated successfully',
            'data' => $restaurant
        ]);
    }

    // DELETE
    public function destroy(string $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        $restaurant->delete();

        return response()->json([
            'message' => 'Restaurant deleted successfully'
        ]);
    }
}