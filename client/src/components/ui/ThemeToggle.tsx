import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center gap-2 p-2 rounded-full border border-gray-800 bg-brand-darker/80 hover:border-brand-gold/60 text-brand-gold transition-all duration-300 shadow-sm ${className}`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-brand-gold" />
        ) : (
          <Moon className="w-4 h-4 text-brand-gold" />
        )}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-300 mr-1">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
