import React from 'react';
import { InboxIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-800 p-4 text-brand-gold">
        {icon || <InboxIcon className="h-8 w-8" />}
      </div>
      <h3 className="mb-2 text-xl font-heading text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-400 font-body">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary">{action.label}</Button>
      )}
    </div>
  );
};
