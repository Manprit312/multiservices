/**
 * Utility functions for the application
 */

/**
 * Logs errors only in development mode
 */
export function logError(message: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  }
}

/**
 * Type guard to check if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Gets error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

