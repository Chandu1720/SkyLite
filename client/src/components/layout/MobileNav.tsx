import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { ThemeToggle } from '../ui/ThemeToggle';

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
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="SkyLite" className="w-6 h-6 object-contain rounded-full" />
                <span className="font-heading text-lg font-bold text-blue-500">SKYLITE</span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 flex-1">
              {links.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={onClose}
                  className="text-lg font-medium text-gray-300 hover:text-blue-400 font-body"
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
