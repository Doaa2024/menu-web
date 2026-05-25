<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
public function chat(Request $request)
{
    $validated = $request->validate([
        'message' => 'required|string',
        'history' => 'nullable|array',
        'history.*.role' => 'required_with:history|in:user,model',
        'history.*.text' => 'required_with:history|string',
    ]);
    $userMessage = $validated['message'];
    $history = $validated['history'] ?? [];

    $apiKey = config('services.gemini.key');
    $model = config('services.gemini.model');
    if (empty($apiKey)) {
        return response()->json([
            'error' => 'Gemini API key is not configured.',
        ], 500);
    }

    // Get menu from DB
    $products = Product::with('subcategory.category')->get();

    // Convert menu to text (guard against missing subcategory/category)
    $menuText = "";

    foreach ($products as $product) {
        $category = optional($product->subcategory)->name ?? 'Uncategorized';
        $menuText .= "
        Name: {$product->name}
        Price: {$product->price}
        Category: {$category}
        Description: {$product->description}
        ";
    }

    // System prompt
    $systemPrompt = "
    You are a restaurant chatbot.

    Here is the menu:
    $menuText

    Answer customer questions briefly using ONLY this menu.
    ";

    // Build the multi-turn conversation: prior history + the new message.
    $contents = [];
    foreach ($history as $turn) {
        $contents[] = [
            'role' => $turn['role'],
            'parts' => [['text' => $turn['text']]],
        ];
    }
    $contents[] = [
        'role' => 'user',
        'parts' => [['text' => $userMessage]],
    ];

    // Send to Gemini (menu goes in system_instruction so it stays out of history)
    $http = Http::withHeaders(['Content-Type' => 'application/json']);

    // Skip SSL verification ONLY on local dev (Windows often lacks a CA bundle).
    // In production the server has real certificates, so we verify properly.
    if (app()->environment('local')) {
        $http = $http->withoutVerifying();
    }

    $response = $http->post(
        "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . $apiKey,
        [
            'system_instruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'contents' => $contents,
        ]
    );

    // Surface API errors instead of crashing on a missing 'candidates' key
    if ($response->failed()) {
        return response()->json([
            'error' => 'Gemini API request failed.',
            'status' => $response->status(),
            'details' => $response->json(),
        ], 502);
    }

    $reply = data_get($response->json(), 'candidates.0.content.parts.0.text');

    if ($reply === null) {
        return response()->json([
            'error' => 'No reply returned by Gemini.',
            'details' => $response->json(),
        ], 502);
    }

    return response()->json([
        'reply' => $reply
    ]);
}
}
