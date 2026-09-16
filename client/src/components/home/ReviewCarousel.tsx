import React from 'react';
import { Star } from 'lucide-react';

export const ReviewCarousel = () => {
  const reviews = [
    { name: 'Rahul S.', rating: 5, text: 'Amazing experience! The decoration was beautiful and the sound quality was top-notch.' },
    { name: 'Priya M.', rating: 5, text: 'Celebrated my parents anniversary here. The team was very cooperative.' },
    { name: 'Amit K.', rating: 4, text: 'Great place for private screening. Will definitely visit again.' }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-white mb-16">Customer <span className="text-brand-gold">Stories</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-brand-darker p-8 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: Math.max(1, Math.min(5, r.rating || 5)) }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <p className="text-gray-300 font-body mb-6 text-sm leading-relaxed">"{r.text}"</p>
              <span className="text-white font-heading font-medium">- {r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
