<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            \Illuminate\Support\Facades\Log::info('Login Request:', $request->all());

            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();
            \Illuminate\Support\Facades\Log::info('User Query Result:', ['user' => $user]);

            if (!$user || !Hash::check($request->password, $user->password)) {
                \Illuminate\Support\Facades\Log::warning('Login Failed: Invalid credentials');
                return response()->json([
                    'message' => 'Email atau password salah',
                    'error' => 'Unauthorized',
                    'statusCode' => 401
                ], 401);
            }

            // Ensure user has a role relation loaded
            $user->load('role');

            // Format user data to match frontend expectation (role as string)
            $userData = $user->toArray();
            $userData['role'] = $user->role ? $user->role->name : null;

            return response()->json([
                'access_token' => $user->createToken('auth_token')->plainTextToken,
                'token_type' => 'Bearer',
                'user' => $userData
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Login Logic Error: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('role'));
    }
}
