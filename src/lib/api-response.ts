import { NextResponse } from 'next/server';

/**
 * Standardized API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

/**
 * Helper to create a success response
 */
export function successResponse<T>(data: T, message?: string, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Helper to create an error response
 */
export function errorResponse(error: string, status: number = 400, message?: string) {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status }
  );
}

/**
 * Helper to create a server error response
 */
export function serverError(error: any = 'Internal Server Error') {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('[API Error]:', error);
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      message: 'An unexpected error occurred on the server.',
    },
    { status: 500 }
  );
}

/**
 * Helper to create an unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized access') {
  return errorResponse(message, 401);
}

/**
 * Helper to create a forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden access') {
  return errorResponse(message, 403);
}

/**
 * Helper to create a not found response
 */
export function notFoundResponse(message: string = 'Resource not found') {
  return errorResponse(message, 404);
}
