import React from 'react';
import { cn } from './Button';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'image' | 'table-row';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'text', className }) => {
  const base = "animate-pulse bg-gray-800 rounded";
  const variants = {
    text: "h-4 w-3/4",
    card: "h-48 w-full rounded-xl",
    image: "h-64 w-full rounded-lg",
    'table-row': "h-12 w-full",
  };
  return <div className={cn(base, variants[variant], className)} />;
};
