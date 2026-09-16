import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '@skylite/shared';

interface PackageCardProps {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  features: string[];
  isPopular?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({ id, name, price, durationMinutes, features, isPopular }) => {
  const safeFeatures: string[] = Array.isArray(features)
    ? features
    : typeof features === 'string'
    ? (() => {
        try {
          const parsed = JSON.parse(features);
          return Array.isArray(parsed) ? parsed : [features];
        } catch {
          return (features as string).split(',').map((f) => f.trim()).filter(Boolean);
        }
      })()
    : [];

  const durationHours = durationMinutes ? durationMinutes / 60 : 2;

  return (
    <div className={`relative rounded-3xl bg-brand-dark p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] ${
      isPopular 
        ? 'border-2 border-brand-gold shadow-[0_0_35px_rgba(212,175,55,0.22)] bg-gradient-to-b from-brand-dark to-brand-darker' 
        : 'border border-gray-800 hover:border-gray-700 shadow-xl'
    }`}>
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-gold to-brand-accent text-brand-darker text-xs font-extrabold px-4 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 fill-brand-darker" /> Most Popular
        </span>
      )}
      
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-heading font-bold text-white mb-2">{name}</h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-3">
            <Clock className="w-3.5 h-3.5 text-brand-gold" />
            <span>{durationHours} Hours Screening & Celebration</span>
          </div>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-brand-gold font-heading tracking-tight">
              {formatCurrency(price)}
            </span>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        <ul className="flex flex-col gap-3.5 mb-8">
          {safeFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 font-body">
              <div className="w-4 h-4 rounded-full bg-brand-gold/15 flex items-center justify-center shrink-0 mt-0.5 text-brand-gold">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Link to={`/book?package=${id}`} className="block w-full">
        <Button 
          variant={isPopular ? 'primary' : 'secondary'} 
          fullWidth
          className={`py-3.5 font-bold flex items-center justify-center gap-2 ${
            isPopular ? 'shadow-[0_0_20px_rgba(212,175,55,0.3)]' : ''
          }`}
        >
          <span>Select Package</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

