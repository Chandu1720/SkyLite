import React from 'react';
import { CalendarDays, Clock, Package, CreditCard, PartyPopper } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    { icon: CalendarDays, title: 'Choose Occasion' },
    { icon: Clock, title: 'Select Date & Time' },
    { icon: Package, title: 'Pick Package' },
    { icon: CreditCard, title: 'Book & Pay' },
    { icon: PartyPopper, title: 'Enjoy' }
  ];

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-white mb-16">How It <span className="text-brand-gold">Works</span></h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10 -translate-y-1/2" />
          
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center mb-10 md:mb-0 relative bg-brand-darker px-4">
              <div className="w-16 h-16 rounded-full bg-brand-dark border-2 border-brand-gold flex items-center justify-center mb-4 text-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <s.icon className="w-7 h-7" />
              </div>
              <h4 className="text-white font-heading font-medium text-center">{s.title}</h4>
              <span className="text-gray-500 text-sm mt-1">Step {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
