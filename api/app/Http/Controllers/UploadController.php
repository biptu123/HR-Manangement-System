<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function storeLogo(Request $request)
    {
        $request->validate([
            'logo' => ['required', 'image', 'mimes:jpeg,png,jpg,svg,webp', 'max:2048'],
        ]);

        // Store the file and generate the public URL
        $path = $request->file('logo')->store('logos', 'public');
        $logoUrl = asset('storage/' . $path);

        return response()->json([
            'message' => 'Logo uploaded successfully',
            'logo_url' => $logoUrl,
        ]);
    }
}