import { toast } from 'sonner';

/**
 * Global error handler for uncaught errors and promise rejections
 */

// Error types
export type ErrorType = 'network' | 'validation' | 'auth' | 'unknown';

// Error handler configuration
interface ErrorHandlerConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
}

const defaultConfig: ErrorHandlerConfig = {
  showToast: true,
  logToConsole: true,
  reportToService: false,
};

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: any): string {
  // API error with response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // API error with status
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. This resource already exists.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return `Error: ${error.response.status}`;
    }
  }

  // Network error
  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection.';
  }

  // Timeout error
  if (error?.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  // Generic error with message
  if (error?.message) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  // Unknown error
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Determine error type
 */
export function getErrorType(error: any): ErrorType {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return 'auth';
  }

  if (error?.response?.status === 400 || error?.response?.status === 422) {
    return 'validation';
  }

  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return 'network';
  }

  return 'unknown';
}

/**
 * Handle error with toast notification
 */
export function handleError(error: any, config: ErrorHandlerConfig = defaultConfig) {
  const message = formatErrorMessage(error);
  const errorType = getErrorType(error);

  // Log to console
  if (config.logToConsole) {
    console.error('[Error Handler]', {
      type: errorType,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  // Show toast notification
  if (config.showToast) {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  }

  // Report to error tracking service (if configured)
  if (config.reportToService) {
    // TODO: Implement error reporting service
    // Example: Sentry.captureException(error);
  }

  return message;
}

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandlers() {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error);
    
    handleError(event.error, {
      showToast: true,
      logToConsole: true,
    });

    // Prevent default browser error handling
    event.preventDefault();
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
    
    handleError(event.reason, {
      showToast: true,
      logToConsole: true,
    });

    // Prevent default browser error handling
    event.preventDefault();
  });

  console.log('✅ Global error handlers initialized');
}

/**
 * Async error wrapper for try-catch blocks
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  config?: ErrorHandlerConfig
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, config);
    return null;
  }
}

/**
 * Error handler for React Query
 */
export function queryErrorHandler(error: any) {
  handleError(error, {
    showToast: true,
    logToConsole: true,
  });
}