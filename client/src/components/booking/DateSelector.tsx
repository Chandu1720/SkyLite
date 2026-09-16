import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface DateSelectorProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  
  const dates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {dates.map((date, index) => {
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);
          const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
          const dayStr = date.getDate().toString();
          const weekdayStr = date.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(date)}
              className={`snap-start flex-shrink-0 w-24 h-32 rounded-xl flex flex-col items-center justify-center border transition-colors ${
                isSelected ? 'bg-brand-gold border-brand-gold text-brand-dark' : 
                'bg-brand-darker border-gray-800 text-white hover:border-brand-gold'
              }`}
            >
              <span className={`text-xs uppercase font-body font-bold mb-2 ${isSelected ? 'text-brand-dark' : 'text-brand-gold'}`}>
                {monthStr}
              </span>
              <span className="text-3xl font-heading font-bold mb-1">
                {dayStr}
              </span>
              <span className={`text-xs font-body ${isSelected ? 'text-brand-dark' : 'text-gray-400'}`}>
                {weekdayStr}
              </span>
              {isToday && (
                <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-brand-dark text-brand-gold' : 'bg-brand-gold text-brand-dark'}`}>
                  TODAY
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};