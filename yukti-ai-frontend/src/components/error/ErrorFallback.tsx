import React from 'react';
import Card from '@components/common/Card';
import RetryButton from './RetryButton';
import { FiAlertOctagon } from 'react-icons/fi';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-[#F7F4ED] dark:bg-[#0A0A09] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8 space-y-6 border-red-500/20 bg-red-500/5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
          <FiAlertOctagon size={28} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-red-600 dark:text-red-400 uppercase tracking-wide">
            Application Crash Blocked
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            An unexpected scripting or rendering error occurred. The details have been captured by our analytics engine.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-[#141311] border border-red-500/15 rounded-xl text-left font-mono text-[10px] text-red-600 dark:text-red-400 break-all max-h-32 overflow-y-auto">
          {error.toString()}
        </div>

        <div className="pt-2">
          <RetryButton onRetry={resetErrorBoundary} label="Reload Interface" />
        </div>
      </Card>
    </div>
  );
};

export default ErrorFallback;
