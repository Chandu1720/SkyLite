import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOnIds: string[];
  onToggle: (id: string) => void;
}

export const AddOnSelector: React.FC<AddOnSelectorProps> = ({ addOns = [], selectedAddOnIds = [], onToggle }) => {
  const safeAddOns = addOns || [];
  const safeSelectedIds = selectedAddOnIds || [];
  const selectedTotal = safeAddOns
    .filter(a => safeSelectedIds.includes(a.id))
    .reduce((sum, a) => sum + (a.price || 0), 0);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center bg-brand-darker p-4 rounded-lg border border-gray-800">
        <span className="font-body text-gray-300">Selected Add-ons Total:</span>
        <span className="font-heading text-xl text-brand-gold">₹{selectedTotal}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeAddOns.map((addon) => {
          const isSelected = safeSelectedIds.includes(addon.id);
          return (
            <motion.div
              key={addon.id}
              onClick={() => onToggle(addon.id)}
              className={`cursor-pointer bg-brand-darker rounded-lg p-4 border flex items-center transition-colors ${
                isSelected ? 'border-brand-gold' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="w-16 h-16 bg-gray-800 rounded mr-4 shrink-0 flex items-center justify-center">
                {addon.imageUrl ? (
                  <img src={addon.imageUrl} alt={addon.name} className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="text-gray-500 text-xs text-center p-1">No Image</span>
                )}
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-heading text-lg leading-tight mb-1">{addon.name}</h4>
                <div className="text-brand-gold font-body text-sm font-semibold">₹{addon.price}</div>
              </div>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-brand-gold text-brand-dark' : 'bg-gray-800 text-gray-400'
              }`}>
                {isSelected ? <Check size={16} /> : <Plus size={16} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};