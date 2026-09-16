import React from 'react';
import { motion } from 'framer-motion';

interface Occasion {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface OccasionSelectorProps {
  occasions: Occasion[];
  selectedOccasionId?: string;
  onSelect: (id: string) => void;
}

export const OccasionSelector: React.FC<OccasionSelectorProps> = ({ occasions = [], selectedOccasionId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(occasions || []).map((occasion) => (
        <motion.div
          key={occasion.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(occasion.id)}
          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${selectedOccasionId === occasion.id ? 'border-brand-gold' : 'border-transparent'}`}
        >
          <div className="relative h-48 bg-brand-darker">
            {/* Placeholder for image */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent z-10" />
            <img src={occasion.imageUrl || 'https://via.placeholder.com/400x300'} alt={occasion.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="text-white font-heading text-xl">{occasion.name}</h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};