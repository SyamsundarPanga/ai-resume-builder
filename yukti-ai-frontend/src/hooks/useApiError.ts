import { useCallback } from 'react';
import ErrorService from '@services/ErrorService';
import { showApiErrorToast } from '../components/error/ErrorToast';

export const useApiError = () => {
  const handleError = useCallback((error: any, onRetry?: () => Promise<void> | void) => {
    const appError = ErrorService.mapError(error);
    showApiErrorToast(appError.message, onRetry);
    return appError;
  }, []);

  return { handleError };
};

export default useApiError;
