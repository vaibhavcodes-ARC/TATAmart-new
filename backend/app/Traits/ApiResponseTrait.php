<?php

namespace App\Traits;

trait ApiResponseTrait
{
    /**
     * Send a successful standard JSON response.
     */
    protected function successResponse($data = [], $message = 'Operation successful', $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Send an error standard JSON response.
     */
    protected function errorResponse($message = 'An error occurred', $statusCode = 400, $data = [])
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }
}
