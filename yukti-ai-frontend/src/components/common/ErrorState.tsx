import React from 'react';
import Card from './Card';
import Button from './Button';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Error Encoded',
  message = 'An unexpected server error occurred. Please verify your connection status.',
  onRetry
}) => {
  return (
    <Card className="text-center py-10 border-red-500/20 bg-red-500/5 space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
        <FiAlertTriangle size={22} />
      </div>
      <div className="space-y-1">
        <h4 className="font-extrabold text-base text-red-600 dark:text-red-400">
          {title}
        </h4>
        <p className="text-xs text-red-500/80 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button size="sm" variant="danger" onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </Card>
  );
};

export default ErrorState;
