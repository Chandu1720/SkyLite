import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface HoldTimerProps {
  expiresAt: string | Date;
  onExpire?: () => void;
}

export const HoldTimer: React.FC<HoldTimerProps> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const targetDate = new Date(expiresAt).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        if (onExpire) onExpire();
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft > 0 && timeLeft < 120;
  const isExpired = timeLeft <= 0;

  return (
    <div className={`flex items-center px-4 py-2 rounded-full font-body font-medium transition-colors ${
      isExpired ? 'bg-red-900/50 text-red-400' :
      isWarning ? 'bg-orange-900/50 text-orange-400' :
      'bg-brand-darker border border-brand-gold/30 text-brand-gold'
    }`}>
      <Clock size={16} className={`mr-2 ${isWarning && !isExpired ? 'animate-pulse' : ''}`} />
      {isExpired ? (
        <span>Slot Expired</span>
      ) : (
        <span>
          Holding slot: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      )}
    </div>
  );
};