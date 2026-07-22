export interface AppError {
  message: string;
  statusCode?: number;
  errorCode?: string;
  originalError: any;
}

export class ErrorService {
  public static mapError(error: any): AppError {
    // 1. Check Offline status
    if (!navigator.onLine) {
      return {
        message: 'No internet connection. Reconnect to continue.',
        errorCode: 'OFFLINE',
        originalError: error
      };
    }

    // 2. Check Request Timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        message: 'Request timed out. Retry?',
        errorCode: 'TIMEOUT',
        originalError: error
      };
    }

    // 3. Check Network Error
    if (error.message === 'Network Error') {
      return {
        message: 'Network Failure. Verify server is running.',
        errorCode: 'NETWORK_ERROR',
        originalError: error
      };
    }

    const response = error.response;
    if (!response) {
      return {
        message: 'Something went wrong. Please try again.',
        errorCode: 'UNKNOWN_ERROR',
        originalError: error
      };
    }

    const status = response.status;
    const responseData = response.data || {};
    const errorCode = responseData.errorCode || '';
    const responseMessage = responseData.message || '';

    // Specialized AI/Cloudinary Check
    if (errorCode === 'GEMINI_TIMEOUT' || responseMessage.toLowerCase().includes('gemini')) {
      return {
        message: 'AI service is temporarily unavailable. Please try again.',
        statusCode: status,
        errorCode: 'GEMINI_ERROR',
        originalError: error
      };
    }

    if (errorCode === 'CLOUDINARY_FAILURE' || responseMessage.toLowerCase().includes('cloudinary')) {
      return {
        message: 'Unable to upload file. Please retry.',
        statusCode: status,
        errorCode: 'CLOUDINARY_ERROR',
        originalError: error
      };
    }

    // Standard HTTP Mappings
    switch (status) {
      case 400:
        return {
          message: responseMessage || 'Invalid Request',
          statusCode: 400,
          errorCode: errorCode || 'BAD_REQUEST',
          originalError: error
        };
      case 401:
        return {
          message: 'Session Expired. Please login again.',
          statusCode: 401,
          errorCode: errorCode || 'UNAUTHORIZED',
          originalError: error
        };
      case 403:
        return {
          message: 'Access Denied',
          statusCode: 403,
          errorCode: errorCode || 'FORBIDDEN',
          originalError: error
        };
      case 404:
        return {
          message: 'Resource not found.',
          statusCode: 404,
          errorCode: errorCode || 'NOT_FOUND',
          originalError: error
        };
      case 409:
        return {
          message: 'Conflict detected.',
          statusCode: 409,
          errorCode: errorCode || 'CONFLICT',
          originalError: error
        };
      case 422:
        return {
          message: 'Validation Failed.',
          statusCode: 422,
          errorCode: errorCode || 'VALIDATION_FAILED',
          originalError: error
        };
      case 429:
        return {
          message: 'Too many requests. Please wait.',
          statusCode: 429,
          errorCode: errorCode || 'TOO_MANY_REQUESTS',
          originalError: error
        };
      case 503:
        return {
          message: 'Service temporarily unavailable.',
          statusCode: 503,
          errorCode: 'SERVICE_UNAVAILABLE',
          originalError: error
        };
      case 500:
      default:
        return {
          message: 'Something went wrong. Please try again.',
          statusCode: status,
          errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
          originalError: error
        };
    }
  }
}

export default ErrorService;
