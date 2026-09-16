import React, { useState } from 'react';
import { AddOnCard } from '../cards/AddOnCard';

export const AddOnGrid = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const addons = [
    { id: '1', name: 'Extra Hour', price: 500, description: 'Add one more hour to your booking' },
    { id: '2', name: 'Cake (1kg)', price: 800, description: 'Chocolate Truffle or Black Forest' },
    { id: '3', name: 'Photography', price: 1500, description: 'Professional photographer for 30 mins' },
    { id: '4', name: 'Fog Entry', price: 300, description: 'Cinematic dry ice fog entry' }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <section className="py-24 bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Extra <span className="text-brand-gold">Magic</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Customize your experience with our add-ons.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {addons.map(a => (
            <AddOnCard key={a.id} {...a} isSelected={selected.includes(a.id)} onToggle={() => toggle(a.id)} />
          ))}
        </div>
      </div>
    </section>
  );
};
