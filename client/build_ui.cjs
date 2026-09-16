const fs = require('fs');
const path = require('path');
const srcDir = 'C:/Users/User-2/.gemini/antigravity/scratch/skylite/client/src';

const dirs = [
  'components/layout',
  'components/ui',
  'components/home',
  'components/cards'
];
dirs.forEach(d => fs.mkdirSync(path.join(srcDir, d), { recursive: true }));

function write(file, content) {
  fs.writeFileSync(path.join(srcDir, file), content.trim() + '\n');
}

write('components/ui/Button.tsx', `
import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:pointer-events-none disabled:opacity-50';
    const variants = {
      primary: 'bg-brand-gold text-brand-darker hover:bg-yellow-500',
      secondary: 'border border-brand-gold text-brand-gold hover:bg-brand-gold/10',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      ghost: 'hover:bg-brand-gold/10 text-brand-gold',
    };
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
`);

write('components/ui/Modal.tsx', `
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, className }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn("w-full max-w-lg overflow-hidden rounded-xl bg-brand-darker border border-gray-800 shadow-2xl pointer-events-auto", className)}
            >
              <div className="flex items-center justify-between border-b border-gray-800 p-4">
                <h3 className="text-lg font-heading font-semibold text-white">{title}</h3>
                <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 text-gray-300 font-body">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-3 border-t border-gray-800 p-4 bg-black/20">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
`);

write('components/ui/Toast.tsx', `
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };
  const bg = {
    success: 'bg-green-500/10 border-green-500/20 text-green-500',
    error: 'bg-red-500/10 border-red-500/20 text-red-500',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={\`flex w-80 items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md \${bg[toast.type]}\`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={onRemove} className="opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
`);

write('components/ui/StatusBadge.tsx', `
import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { cn } from './Button';

interface StatusBadgeProps {
  status: string;
  type: 'booking' | 'payment' | 'slot';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className }) => {
  const config = {
    booking: {
      PENDING: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Pending' },
      CONFIRMED: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Confirmed' },
      CANCELLED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Cancelled' },
      COMPLETED: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: CheckCircle2, label: 'Completed' },
    },
    payment: {
      PENDING: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Payment Pending' },
      COMPLETED: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Paid' },
      FAILED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertCircle, label: 'Payment Failed' },
      REFUNDED: { color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: CheckCircle2, label: 'Refunded' },
    },
    slot: {
      AVAILABLE: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Available' },
      BOOKED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Booked' },
      BLOCKED: { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', icon: XCircle, label: 'Blocked' },
      HELD: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Held' },
    },
  } as Record<string, Record<string, { color: string; icon: any; label: string }>>;

  const s = config[type]?.[status.toUpperCase()] || { color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: AlertCircle, label: status };
  const Icon = s.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", s.color, className)}>
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
};
`);

write('components/ui/LoadingSkeleton.tsx', `
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
`);

write('components/ui/EmptyState.tsx', `
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
`);

write('components/ui/ErrorState.tsx', `
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
`);

write('components/ui/WhatsAppButton.tsx', `
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
  phoneNumber = '919999999999', 
  message = 'Hi, I would like to know more about SkyLite Private Theatre.',
  variant = 'inline',
  className 
}) => {
  const url = \`https://wa.me/\${phoneNumber}?text=\${encodeURIComponent(message)}\`;
  
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
`);

write('components/layout/Navbar.tsx', `
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { MobileNav } from './MobileNav';
import { cn } from '../ui/Button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Occasions', path: '/occasions' },
    { name: 'Theatres', path: '/theatres' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        isScrolled ? "bg-brand-darker/90 backdrop-blur-md border-b border-gray-800 shadow-lg py-3" : "bg-transparent py-5"
      )}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-wider text-brand-gold">
              SKY<span className="text-white">LITE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-gold font-body",
                  location.pathname === link.path ? "text-brand-gold" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button variant="primary" size="sm">Book Now</Button>
          </div>

          <button 
            className="md:hidden text-gray-300 hover:text-brand-gold"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} links={links} />
    </>
  );
};
`);

write('components/layout/MobileNav.tsx', `
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; path: string; }[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, links }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-64 bg-brand-darker border-l border-gray-800 p-6 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-heading text-xl font-bold text-brand-gold">MENU</span>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 flex-1">
              {links.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={onClose}
                  className="text-lg font-medium text-gray-300 hover:text-brand-gold font-body"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-gray-800">
              <WhatsAppButton fullWidth className="justify-center" />
              <Button variant="primary" fullWidth onClick={onClose}>Book Now</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
`);

write('components/layout/Footer.tsx', `
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-darker border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="font-heading text-2xl font-bold tracking-wider text-brand-gold mb-4 block">
              SKY<span className="text-white">LITE</span>
            </span>
            <p className="text-gray-400 text-sm font-body leading-relaxed mb-6">
              Experience celebrations like never before in your own private cinema. Premium sound, spectacular screens, and customized decorations for your special moments.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-brand-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-gold transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-gold transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg text-white font-semibold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-gray-400">
              <li><Link to="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link to="/occasions" className="hover:text-brand-gold transition-colors">Occasions</Link></li>
              <li><Link to="/theatres" className="hover:text-brand-gold transition-colors">Theatres</Link></li>
              <li><Link to="/packages" className="hover:text-brand-gold transition-colors">Packages</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-gold transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg text-white font-semibold mb-6">Contact Info</h4>
            <ul className="flex flex-col gap-4 font-body text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                <span>123 Luxury Avenue, Cinema District, Metro City 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                <span>hello@skylite.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm font-body mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-brand-dark border border-gray-700 rounded-l-md px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-brand-gold" />
              <button className="bg-brand-gold text-brand-darker px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-yellow-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-body">
          <p>&copy; {new Date().getFullYear()} SkyLite Private Theatre. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
            <Link to="/cancellation" className="hover:text-gray-300">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
`);

write('components/cards/OccasionCard.tsx', `
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface OccasionCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export const OccasionCard: React.FC<OccasionCardProps> = ({ id, name, description, imageUrl, isFeatured }) => {
  return (
    <Link to={\`/book?occasion=\${id}\`} className="block group">
      <motion.div 
        whileHover={{ y: -5 }}
        className="relative overflow-hidden rounded-xl bg-brand-dark border border-gray-800 h-full"
      >
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-800 to-brand-dark relative">
          {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />}
          {!imageUrl && <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-transparent" />}
          {isFeatured && (
            <span className="absolute top-3 right-3 bg-brand-gold text-brand-darker text-xs font-bold px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-heading font-semibold text-white mb-2 group-hover:text-brand-gold transition-colors">{name}</h3>
          <p className="text-gray-400 text-sm font-body line-clamp-2">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};
`);

write('components/cards/TheatreCard.tsx', `
import React from 'react';
import { Users, Monitor, Speaker } from 'lucide-react';
import { Button } from '../ui/Button';

interface TheatreCardProps {
  id: string;
  name: string;
  capacity: number;
  basePrice: number;
  imageUrl?: string;
}

export const TheatreCard: React.FC<TheatreCardProps> = ({ id, name, capacity, basePrice, imageUrl }) => {
  return (
    <div className="rounded-xl bg-brand-dark border border-gray-800 overflow-hidden flex flex-col">
      <div className="aspect-video bg-gray-800 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-darker to-brand-dark" />
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-heading font-semibold text-white">{name}</h3>
          <div className="text-right">
            <span className="text-xs text-gray-400 font-body block">Starting from</span>
            <span className="text-lg font-bold text-brand-gold">₹{basePrice}</span>
          </div>
        </div>
        
        <div className="flex gap-4 mb-6 text-sm text-gray-300 font-body">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-gold" />
            <span>Up to {capacity} pax</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-brand-gold" />
            <span>4K Laser</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Speaker className="w-4 h-4 text-brand-gold" />
            <span>Dolby Atmos</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-800">
          <Button fullWidth variant="secondary">Book {name}</Button>
        </div>
      </div>
    </div>
  );
};
`);

write('components/cards/PackageCard.tsx', `
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface PackageCardProps {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  features: string[];
  isPopular?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({ name, price, durationMinutes, features, isPopular }) => {
  return (
    <div className={\`relative rounded-2xl bg-brand-dark p-6 md:p-8 flex flex-col \${isPopular ? 'border-2 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border border-gray-800'}\`}>
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-darker text-sm font-bold px-4 py-1 rounded-full">
          Most Popular
        </span>
      )}
      
      <h3 className="text-2xl font-heading font-semibold text-white mb-2 text-center">{name}</h3>
      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-brand-gold">₹{price}</span>
        <span className="text-gray-400 text-sm font-body ml-2">/ {durationMinutes / 60} hrs</span>
      </div>
      
      <ul className="flex flex-col gap-4 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-body">
            <Check className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button variant={isPopular ? 'primary' : 'secondary'} fullWidth>
        Select Package
      </Button>
    </div>
  );
};
`);

write('components/cards/AddOnCard.tsx', `
import React from 'react';
import { Plus, Check } from 'lucide-react';

interface AddOnCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const AddOnCard: React.FC<AddOnCardProps> = ({ name, price, description, isSelected, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className={\`cursor-pointer rounded-xl border p-4 transition-all \${
        isSelected ? 'bg-brand-gold/5 border-brand-gold' : 'bg-brand-dark border-gray-800 hover:border-gray-600'
      }\`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-heading font-medium text-white">{name}</h4>
        <div className={\`flex items-center justify-center w-6 h-6 rounded-full \${isSelected ? 'bg-brand-gold text-brand-darker' : 'bg-gray-800 text-gray-400'}\`}>
          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </div>
      <p className="text-xl font-bold text-brand-gold mb-2">₹{price}</p>
      <p className="text-sm text-gray-400 font-body line-clamp-2">{description}</p>
    </div>
  );
};
`);

write('components/cards/SlotCard.tsx', `
import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { cn } from '../ui/Button';

interface SlotCardProps {
  id: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'HELD';
  isSelected?: boolean;
  onClick?: () => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({ startTime, endTime, status, isSelected, onClick }) => {
  const isAvailable = status === 'AVAILABLE';
  
  return (
    <button
      onClick={() => isAvailable && onClick?.()}
      disabled={!isAvailable}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center gap-2 w-full",
        isAvailable ? "cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5" : "cursor-not-allowed opacity-60",
        isSelected && isAvailable ? "border-brand-gold bg-brand-gold/10" : "border-gray-800 bg-brand-dark",
      )}
    >
      <span className="text-sm font-semibold text-white">
        {startTime} - {endTime}
      </span>
      <StatusBadge status={status} type="slot" />
    </button>
  );
};
`);

write('components/home/Hero.tsx', `
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative min-h-[100svh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-brand-darker">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-darker/60 via-brand-darker/80 to-brand-darker z-10" />
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center opacity-30" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
        >
          Your Private Theatre.<br/>
          <span className="text-brand-gold">Your Special Moment.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
        >
          Experience celebrations like never before in your own private cinema. Premium sound, spectacular screens, and customized decorations.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button variant="primary" size="lg">Book Your Experience</Button>
          <Button variant="secondary" size="lg">Explore Packages</Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-gray-400"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </div>
  );
};
`);

write('components/home/WhySkyLite.tsx', `
import React from 'react';
import { Lock, MonitorPlay, Sparkles, PartyPopper, CalendarCheck, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhySkyLite = () => {
  const features = [
    { icon: Lock, title: 'Private & Exclusive', desc: 'The entire theatre is reserved solely for you and your guests.' },
    { icon: MonitorPlay, title: 'Premium Sound & Screen', desc: '4K Ultra HD projection and immersive Dolby Atmos sound system.' },
    { icon: Sparkles, title: 'Custom Decorations', desc: 'Personalized decor with balloons, flowers, and neon signs.' },
    { icon: PartyPopper, title: 'Perfect For Every Occasion', desc: 'Birthdays, anniversaries, proposals, or private screenings.' },
    { icon: CalendarCheck, title: 'Easy Online Booking', desc: 'Check availability and book your slot in just a few clicks.' },
    { icon: Smile, title: 'Hassle-Free Experience', desc: 'We take care of everything so you can focus on enjoying.' }
  ];

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Why Choose <span className="text-brand-gold">SkyLite?</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Discover what makes our private theatre experience truly special.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-dark p-8 rounded-2xl border border-gray-800 hover:border-brand-gold/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                <f.icon className="w-7 h-7 text-brand-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 font-body text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/OccasionGrid.tsx', `
import React from 'react';
import { OccasionCard } from '../cards/OccasionCard';
import { Link } from 'react-router-dom';

export const OccasionGrid = () => {
  const occasions = [
    { id: '1', name: 'Birthday Celebration', description: 'Make their day special with a private screening and custom decor.', isFeatured: true },
    { id: '2', name: 'Anniversary Date', description: 'A romantic private movie date for you and your partner.' },
    { id: '3', name: 'Proposal Event', description: 'Pop the question in a magical, private setting.', isFeatured: true },
    { id: '4', name: 'Private Screening', description: 'Watch your favorite movies or shows with friends and family.' }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Celebrate <span className="text-brand-gold">Occasions</span></h2>
            <p className="text-gray-400 font-body">Tailored experiences for every special moment.</p>
          </div>
          <Link to="/occasions" className="hidden md:block text-brand-gold hover:text-white transition-colors font-medium pb-2 border-b border-brand-gold hover:border-white">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map(occ => (
            <OccasionCard key={occ.id} {...occ} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link to="/occasions" className="text-brand-gold border border-brand-gold px-6 py-3 rounded-md block w-full">
            View All Occasions
          </Link>
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/TheatreExperience.tsx', `
import React from 'react';
import { TheatreCard } from '../cards/TheatreCard';

export const TheatreExperience = () => {
  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our <span className="text-brand-gold">Theatres</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Choose the perfect setting for your group size and preferences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <TheatreCard id="t1" name="Cozy Cove" capacity={4} basePrice={1499} />
          <TheatreCard id="t2" name="Grand Lounge" capacity={10} basePrice={2999} />
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/PackageShowcase.tsx', `
import React from 'react';
import { PackageCard } from '../cards/PackageCard';
import { Button } from '../ui/Button';

export const PackageShowcase = () => {
  const pkgs = [
    { id: '1', name: 'Basic', price: 1499, durationMinutes: 180, features: ['3 Hours Theatre Access', 'Basic Decor', 'Welcome Drinks'] },
    { id: '2', name: 'Premium', price: 2999, durationMinutes: 180, features: ['3 Hours Theatre Access', 'Premium Balloon Decor', 'Welcome Drinks & Snacks', 'Custom Message on Screen'], isPopular: true },
    { id: '3', name: 'Luxury', price: 4999, durationMinutes: 240, features: ['4 Hours Theatre Access', 'Luxury Floral & Balloon Decor', 'Full Course Meal for 2', 'Professional Photography'] }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Curated <span className="text-brand-gold">Packages</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Simple pricing, extraordinary experiences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {pkgs.map(p => (
            <div key={p.id} className={p.isPopular ? 'md:-mt-8 md:mb-8' : ''}>
              <PackageCard {...p} />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="ghost">View All Packages</Button>
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/AddOnGrid.tsx', `
import React, { useState } from 'react';
import { AddOnCard } from '../cards/AddOnCard';

export const AddOnGrid = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const addons = [
    { id: '1', name: 'Extra Hour', price: 500, description: 'Add one more hour to your booking' },
    { id: '2', name: 'Cake (1kg)', price: 800, description: 'Chocolate Truffle or Black Forest' },
    { id: '3', name: 'Photography', price: 1500, description: 'Professional photographer for 30 mins' },
    { id: '4', name: 'Fog Entry', price: 300, description: 'Cinematic dry ice fog entry' }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Extra <span className="text-brand-gold">Magic</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Customize your experience with our add-ons.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {addons.map(a => (
            <AddOnCard key={a.id} {...a} isSelected={selected.includes(a.id)} onToggle={() => toggle(a.id)} />
          ))}
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/GallerySection.tsx', `
import React from 'react';
import { Button } from '../ui/Button';

export const GallerySection = () => {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Moments at <span className="text-brand-gold">SkyLite</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-brand-darker/50" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <span className="text-white font-medium">View</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button variant="secondary">View Full Gallery</Button>
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/HowItWorks.tsx', `
import React from 'react';
import { CalendarDays, Clock, Package, CreditCard, PartyPopper } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    { icon: CalendarDays, title: 'Choose Occasion' },
    { icon: Clock, title: 'Select Date & Time' },
    { icon: Package, title: 'Pick Package' },
    { icon: CreditCard, title: 'Book & Pay' },
    { icon: PartyPopper, title: 'Enjoy' }
  ];

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-white mb-16">How It <span className="text-brand-gold">Works</span></h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10 -translate-y-1/2" />
          
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center mb-10 md:mb-0 relative bg-brand-darker px-4">
              <div className="w-16 h-16 rounded-full bg-brand-dark border-2 border-brand-gold flex items-center justify-center mb-4 text-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <s.icon className="w-7 h-7" />
              </div>
              <h4 className="text-white font-heading font-medium text-center">{s.title}</h4>
              <span className="text-gray-500 text-sm mt-1">Step {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/ReviewCarousel.tsx', `
import React from 'react';
import { Star } from 'lucide-react';

export const ReviewCarousel = () => {
  const reviews = [
    { name: 'Rahul S.', rating: 5, text: 'Amazing experience! The decoration was beautiful and the sound quality was top-notch.' },
    { name: 'Priya M.', rating: 5, text: 'Celebrated my parents anniversary here. The team was very cooperative.' },
    { name: 'Amit K.', rating: 4, text: 'Great place for private screening. Will definitely visit again.' }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-white mb-16">Customer <span className="text-brand-gold">Stories</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-brand-darker p-8 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
              </div>
              <p className="text-gray-300 font-body mb-6 text-sm leading-relaxed">"{r.text}"</p>
              <span className="text-white font-heading font-medium">- {r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/FAQSection.tsx', `
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../ui/Button';

export const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: 'Can we bring outside food?', a: 'Outside food is not allowed. We have a complete menu of snacks and beverages available.' },
    { q: 'What is the cancellation policy?', a: 'Full refund for cancellations made 48 hours prior. 50% refund for 24 hours prior. No refund for same-day cancellations.' },
    { q: 'Can we decorate the theatre ourselves?', a: 'We provide comprehensive decoration packages. Outside decorators or materials are not permitted for safety reasons.' },
    { q: 'Is there a minimum age limit?', a: 'No minimum age, but children under 12 must be accompanied by adults.' }
  ];

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-white mb-16">Frequently Asked <span className="text-brand-gold">Questions</span></h2>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-800 rounded-lg overflow-hidden bg-brand-dark">
              <button 
                className="w-full flex justify-between items-center p-5 text-left text-white font-heading hover:bg-gray-800/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="p-5 pt-0 text-gray-400 font-body text-sm leading-relaxed border-t border-gray-800/50 mt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
`);

write('components/home/LocationSection.tsx', `
import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

export const LocationSection = () => {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">Find <span className="text-brand-gold">Us</span></h2>
            
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-heading text-lg mb-1">Address</h4>
                  <p className="text-gray-400 font-body text-sm">123 Luxury Avenue, Cinema District<br/>Metro City 400001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-heading text-lg mb-1">Hours</h4>
                  <p className="text-gray-400 font-body text-sm">Open Daily: 10:00 AM - 11:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-heading text-lg mb-1">Contact</h4>
                  <p className="text-gray-400 font-body text-sm">+91 99999 99999<br/>hello@skylite.com</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={() => window.open('https://maps.google.com', '_blank')}
            >
              Get Directions
            </Button>
          </div>
          
          <div className="h-[400px] bg-brand-darker rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent" />
            <div className="text-center z-10 p-6">
              <MapPin className="w-12 h-12 text-brand-gold mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 font-body">Interactive Map Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
`);

console.log('UI files created successfully.');
