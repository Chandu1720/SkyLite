import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from './Button';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'floating' | 'inline';
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber = '918008292789', 
  message = 'Hi, I would like to know more about SkyLite Private Theatre.',
  variant = 'inline',
  className 
}) => {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  if (variant === 'floating') {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn("fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600", className)}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600", className)}
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp Us
    </a>
  );
};
