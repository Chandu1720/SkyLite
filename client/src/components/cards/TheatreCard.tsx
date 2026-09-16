import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Monitor, Speaker, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '@skylite/shared';

interface TheatreCardProps {
  id: string;
  name: string;
  capacity: number;
  basePrice: number;
  imageUrl?: string;
}

export const TheatreCard: React.FC<TheatreCardProps> = ({ id, name, capacity, basePrice, imageUrl }) => {
  return (
    <div className="rounded-3xl bg-brand-dark border border-gray-800 hover:border-brand-gold/50 overflow-hidden flex flex-col shadow-xl transition-all duration-300 hover:translate-y-[-4px] group">
      <div className="aspect-[16/10] bg-gray-900 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-brand-darker to-brand-dark flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-brand-gold/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
        
        <span className="absolute bottom-3 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md text-brand-gold border border-brand-gold/20">
          Private Screening Hall
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-brand-gold transition-colors">{name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Acoustically Treated Audiophile Lounge</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Starts At</span>
              <span className="text-xl font-extrabold text-brand-gold font-heading">{formatCurrency(basePrice)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-brand-darker rounded-2xl border border-gray-800/80 mb-6 text-xs text-gray-300">
            <div className="flex flex-col items-center text-center gap-1">
              <Users className="w-4 h-4 text-brand-gold" />
              <span className="font-semibold text-white">Up to {capacity}</span>
              <span className="text-[10px] text-gray-500">Guests</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 border-x border-gray-800">
              <Monitor className="w-4 h-4 text-brand-gold" />
              <span className="font-semibold text-white">4K HDR</span>
              <span className="text-[10px] text-gray-500">Laser Screen</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Speaker className="w-4 h-4 text-brand-gold" />
              <span className="font-semibold text-white">Dolby 7.1</span>
              <span className="text-[10px] text-gray-500">Atmos Audio</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Link to={`/book?theatre=${id}`} className="block w-full">
            <Button fullWidth variant="secondary" className="group-hover:border-brand-gold/60 group-hover:text-brand-gold font-bold flex items-center justify-center gap-2">
              <span>Book This Hall</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

