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
