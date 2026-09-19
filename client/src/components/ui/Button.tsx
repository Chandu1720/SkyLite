import React from 'react';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      loading,
      fullWidth,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isBusy = isLoading || loading;
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white hover:from-blue-500 hover:to-sky-400 shadow-md shadow-blue-500/25 border border-blue-400/30 font-bold',
      secondary: 'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30',
      ghost: 'hover:bg-blue-500/10 text-blue-400',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={isBusy || disabled}
        {...props}
      >
        {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />}
        {!isBusy && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isBusy && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
