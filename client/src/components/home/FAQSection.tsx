import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../ui/Button';

export const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: 'Can we bring outside food?', a: 'Outside food is not allowed. We have a complete menu of snacks and beverages available.' },
    { q: 'What is the cancellation policy?', a: 'Full refund for cancellations made 48 hours prior. 50% refund for 24 hours prior. No refund for same-day cancellations.' },
    { q: 'Can we decorate the theatre ourselves?', a: 'We provide comprehensive decoration packages. Outside decorators or materials are not permitted for safety reasons.' },
    { q: 'Is there a minimum age limit?', a: 'No minimum age, but children under 12 must be accompanied by adults.' }
  ];

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-white mb-16">Frequently Asked <span className="text-brand-gold">Questions</span></h2>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-800 rounded-lg overflow-hidden bg-brand-dark">
              <button 
                className="w-full flex justify-between items-center p-5 text-left text-white font-heading hover:bg-gray-800/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="p-5 pt-0 text-gray-400 font-body text-sm leading-relaxed border-t border-gray-800/50 mt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
