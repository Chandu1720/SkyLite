import React from 'react';
import { TheatreCard } from '../cards/TheatreCard';

export const TheatreExperience = () => {
  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our <span className="text-brand-gold">Theatres</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Choose the perfect setting for your group size and preferences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <TheatreCard id="t1" name="Cozy Cove" capacity={4} basePrice={1499} />
          <TheatreCard id="t2" name="Grand Lounge" capacity={10} basePrice={2999} />
        </div>
      </div>
    </section>
  );
};
