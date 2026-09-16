import React from 'react';
import { Lock, MonitorPlay, Sparkles, PartyPopper, CalendarCheck, Smile, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhySkyLite = () => {
  const features = [
    { 
      icon: Lock, 
      title: '100% Private & Exclusive', 
      desc: 'The entire theatre hall, acoustic seating, and lounge are reserved solely for you and your chosen guests with zero outside disturbance.' 
    },
    { 
      icon: MonitorPlay, 
      title: '4K Cinema & Dolby Atmos', 
      desc: 'Enjoy thrilling visual depth on ultra-wide 4K laser screens powered by studio-grade Dolby Atmos multi-channel surround sound.' 
    },
    { 
      icon: Sparkles, 
      title: 'Tailor-Made Celebrations', 
      desc: 'Personalised neon signs, luxury floral arches, balloon decorations, LED candle paths, and custom anniversary/birthday setups.' 
    },
    { 
      icon: PartyPopper, 
      title: 'Every Occasion Covered', 
      desc: 'Birthdays, romantic proposals, anniversaries, family movie marathons, binge-watching gaming tournaments, and reunions.' 
    },
    { 
      icon: CalendarCheck, 
      title: 'Instant Online Booking', 
      desc: 'Real-time slot availability, instant confirmation, flexible advance booking, and secure UPI payment options.' 
    },
    { 
      icon: Smile, 
      title: 'Hassle-Free Hospitality', 
      desc: 'Dedicated concierge team handles cake setup, photo moments, and audio/video streaming so you can relax completely.' 
    }
  ];

  return (
    <section className="py-24 bg-brand-darker relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" /> The SkyLite Distinction
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Why Choose <span className="bg-gradient-to-r from-[#F7E7B4] via-brand-gold to-brand-accent bg-clip-text text-transparent">SkyLite?</span>
          </h2>
          <p className="text-gray-400 font-body text-sm sm:text-base leading-relaxed">
            Crafted for movie lovers and celebratory moments, we combine five-star private luxury with state-of-the-art entertainment technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-brand-dark/90 backdrop-blur-md p-8 rounded-3xl border border-gray-800/90 hover:border-brand-gold/40 transition-all duration-300 shadow-xl group hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-brand-gold/50 transition-all">
                  <f.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">{f.title}</h3>
                <p className="text-gray-400 font-body text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

