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
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        isSelected ? 'bg-brand-gold/5 border-brand-gold' : 'bg-brand-dark border-gray-800 hover:border-gray-600'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-heading font-medium text-white">{name}</h4>
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isSelected ? 'bg-brand-gold text-brand-darker' : 'bg-gray-800 text-gray-400'}`}>
          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </div>
      <p className="text-xl font-bold text-brand-gold mb-2">₹{price}</p>
      <p className="text-sm text-gray-400 font-body line-clamp-2">{description}</p>
    </div>
  );
};
