import React, { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import Button from '@components/common/Button';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  label?: string;
}

export const RetryButton: React.FC<RetryButtonProps> = ({ onRetry, label = 'Retry' }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed', err);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Button
      onClick={handleRetry}
      size="sm"
      disabled={retrying}
      className="inline-flex items-center space-x-1.5"
    >
      <FiRefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
      <span>{retrying ? 'Retrying...' : label}</span>
    </Button>
  );
};

export default RetryButton;
