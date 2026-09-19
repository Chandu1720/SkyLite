import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ChevronDown, Sparkles, Star, Film, Volume2, Heart, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="hero-container relative min-h-[92vh] md:min-h-[96vh] flex items-center justify-center overflow-hidden bg-brand-darker pt-24 pb-16">
      {/* Background with luxury cinema ambiance */}
      <div className="absolute inset-0 z-0">
        <div className="hero-bg-overlay absolute inset-0 bg-gradient-to-b from-brand-darker/70 via-brand-darker/85 to-brand-darker z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[300px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div 
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center opacity-25 scale-105" 
          style={{ transform: 'scale(1.03)', transition: 'transform 10s ease-out' }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10 text-center flex flex-col items-center">
        {/* Luxury Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs md:text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>India's Premier Private Cinema & Celebration Experience</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hero-headline font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 max-w-5xl tracking-tight"
        >
          Your Private Theatre.<br/>
          <span className="hero-headline-gradient bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">
            Your Special Moment.
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-body text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed"
        >
          Celebrate birthdays, anniversaries, romantic date nights & movie screenings in complete privacy with 4K laser projection, Dolby Atmos sound, and tailor-made decor.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-3xl text-xs md:text-sm"
        >
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-dark/80 border border-blue-500/20 text-gray-200 backdrop-blur-md">
            <Film className="w-4 h-4 text-blue-400" />
            <span>4K Laser Screen</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-dark/80 border border-blue-500/20 text-gray-200 backdrop-blur-md">
            <Volume2 className="w-4 h-4 text-blue-400" />
            <span>Dolby Atmos Audio</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-dark/80 border border-blue-500/20 text-gray-200 backdrop-blur-md">
            <Heart className="w-4 h-4 text-sky-400" />
            <span>Custom Decor & Cake</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-dark/80 border border-blue-500/20 text-gray-200 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Private & Sanitized</span>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/book" className="w-full sm:w-auto">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              Book Your Experience
            </Button>
          </Link>
          <Link to="/packages" className="w-full sm:w-auto">
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold border-blue-500/30 hover:border-blue-400 text-white hover:text-blue-400 transition-all"
            >
              Explore Packages & Pricing
            </Button>
          </Link>
        </motion.div>

        {/* Rating proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex items-center gap-2 text-xs md:text-sm text-gray-400"
        >
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-white">4.9 / 5.0</span>
          <span>from 500+ happy celebrations</span>
        </motion.div>
      </div>

      {/* Scroll Down Cue */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce text-gray-500 hover:text-brand-gold transition-colors cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
      >
        <ChevronDown className="w-7 h-7" />
      </motion.div>
    </div>
  );
};

