import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OccasionCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export const OccasionCard: React.FC<OccasionCardProps> = ({ id, name, description, imageUrl, isFeatured }) => {
  return (
    <Link to={`/book?occasion=${id}`} className="block group h-full">
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-2xl bg-brand-dark border border-gray-800 hover:border-brand-gold/60 h-full flex flex-col shadow-xl transition-all duration-300 group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
      >
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-900 to-brand-dark relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-108 transition-all duration-700" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 via-brand-darker/60 to-brand-dark flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-brand-gold/30 group-hover:text-brand-gold/60 transition-colors" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
          
          {isFeatured && (
            <span className="absolute top-3 right-3 bg-brand-gold text-brand-darker text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-brand-darker" /> Featured
            </span>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-1.5 group-hover:text-brand-gold transition-colors flex items-center justify-between">
              <span>{name}</span>
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-body line-clamp-2 leading-relaxed mb-4">
              {description}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-semibold text-brand-gold group-hover:text-[#F7E7B4] transition-colors">
            <span>Book Celebration</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

