import React from 'react';
import { motion } from 'framer-motion';

// Mock formatTime12h for now since @skylite/shared is not available here directly in this block
const formatTime12h = (time: string) => time; 

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
}

interface SlotSelectorProps {
  slots: Slot[];
  selectedSlotId?: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ slots = [], selectedSlotId, onSelect, isLoading }) => {
  const safeSlots = slots || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="animate-pulse bg-brand-darker h-24 rounded-lg border border-gray-800" />
        ))}
      </div>
    );
  }

  if (safeSlots.length === 0) {
    return (
      <div className="text-center py-12 bg-brand-darker rounded-lg">
        <p className="text-gray-400 font-body">No slots available for this date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {safeSlots.map((slot) => {
        const isAvailable = slot.status === 'AVAILABLE';
        const isSelected = selectedSlotId === slot.id;

        return (
          <motion.button
            key={slot.id}
            whileTap={isAvailable ? { scale: 0.95 } : {}}
            disabled={!isAvailable}
            onClick={() => onSelect(slot.id)}
            className={`p-4 rounded-lg flex flex-col items-center justify-center border transition-all ${
              isSelected ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 
              isAvailable ? 'bg-brand-darker border-gray-800 text-white hover:border-brand-gold/50' : 
              'bg-brand-darker/50 border-gray-900 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="font-heading text-lg mb-1">{formatTime12h(slot.startTime)}</span>
            <span className="text-xs font-body opacity-70">to {formatTime12h(slot.endTime)}</span>
            {!isAvailable && (
              <span className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                {slot.status}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};