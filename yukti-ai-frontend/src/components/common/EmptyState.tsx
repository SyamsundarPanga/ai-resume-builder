import React from 'react';
import Card from './Card';
import Button from './Button';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <FiInbox size={40} className="text-[#B8860B]/30 mx-auto" />
}) => {
  return (
    <Card className="text-center py-10 space-y-4">
      <div>{icon}</div>
      <div className="space-y-1">
        <h4 className="font-extrabold text-base text-slate-800 dark:text-[#F7F4ED]">
          {title}
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
