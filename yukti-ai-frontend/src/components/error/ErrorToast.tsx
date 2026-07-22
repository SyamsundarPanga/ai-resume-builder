import React from 'react';
import toast from 'react-hot-toast';
import { FiAlertCircle } from 'react-icons/fi';
import RetryButton from './RetryButton';

interface ErrorToastProps {
  message: string;
  onRetry?: () => Promise<void> | void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-between space-x-4 p-1 text-xs">
      <div className="flex items-center space-x-2 text-red-500">
        <FiAlertCircle className="w-4 h-4 shrink-0" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">{message}</span>
      </div>
      {onRetry && (
        <div className="shrink-0">
          <RetryButton onRetry={onRetry} label="Retry" />
        </div>
      )}
    </div>
  );
};

export const showApiErrorToast = (message: string, onRetry?: () => Promise<void> | void) => {
  toast((t) => (
    <div className="flex items-center justify-between w-full">
      <ErrorToast message={message} onRetry={onRetry ? () => { toast.dismiss(t.id); onRetry(); } : undefined} />
    </div>
  ), {
    duration: 6000,
    style: {
      maxWidth: '450px',
      borderRadius: '16px',
      border: '1px solid rgba(239, 68, 68, 0.15)',
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }
  });
};

export default ErrorToast;
