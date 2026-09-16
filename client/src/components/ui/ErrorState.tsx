import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = 'Something went wrong', 
  description = 'An error occurred while loading this content. Please try again.', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-red-500/20 bg-red-500/5">
      <AlertTriangle className="mb-4 h-10 w-10 text-red-500" />
      <h3 className="mb-2 text-lg font-heading text-red-400">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-red-300/70 font-body">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm">Retry</Button>
      )}
    </div>
  );
};
