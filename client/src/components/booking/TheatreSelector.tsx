import React from 'react';
import { Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Theatre {
  id: string;
  name: string;
  capacity: number;
  location: string;
  price: number;
  imageUrl: string;
}

interface TheatreSelectorProps {
  theatres: Theatre[];
  selectedTheatreId?: string;
  onSelect: (id: string) => void;
}

export const TheatreSelector: React.FC<TheatreSelectorProps> = ({ theatres = [], selectedTheatreId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {(theatres || []).map((theatre) => (
        <motion.div
          key={theatre.id}
          className={`bg-brand-darker rounded-lg border ${selectedTheatreId === theatre.id ? 'border-brand-gold' : 'border-gray-800'} overflow-hidden flex flex-col md:flex-row`}
        >
          <div className="md:w-1/3 h-48 md:h-auto bg-gray-800">
            <img src={theatre.imageUrl || 'https://via.placeholder.com/400'} alt={theatre.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-heading text-white mb-2">{theatre.name}</h3>
              <div className="flex items-center text-gray-400 mb-2 font-body text-sm">
                <Users size={16} className="mr-2 text-brand-gold" />
                <span>Up to {theatre.capacity} guests</span>
              </div>
              <div className="flex items-center text-gray-400 mb-4 font-body text-sm">
                <MapPin size={16} className="mr-2 text-brand-gold" />
                <span>{theatre.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-brand-gold font-heading text-xl">
                ₹{theatre.price}
              </div>
              <button
                onClick={() => onSelect(theatre.id)}
                className={`px-6 py-2 rounded font-body font-medium transition-colors ${selectedTheatreId === theatre.id ? 'bg-brand-gold text-brand-dark' : 'bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark'}`}
              >
                {selectedTheatreId === theatre.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};