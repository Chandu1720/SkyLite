import React from 'react';
import { PackageCard } from '../cards/PackageCard';
import { Button } from '../ui/Button';

export const PackageShowcase = () => {
  const pkgs = [
    { id: '1', name: 'Basic', price: 1499, durationMinutes: 180, features: ['3 Hours Theatre Access', 'Basic Decor', 'Welcome Drinks'] },
    { id: '2', name: 'Premium', price: 2999, durationMinutes: 180, features: ['3 Hours Theatre Access', 'Premium Balloon Decor', 'Welcome Drinks & Snacks', 'Custom Message on Screen'], isPopular: true },
    { id: '3', name: 'Luxury', price: 4999, durationMinutes: 240, features: ['4 Hours Theatre Access', 'Luxury Floral & Balloon Decor', 'Full Course Meal for 2', 'Professional Photography'] }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Curated <span className="text-brand-gold">Packages</span></h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">Simple pricing, extraordinary experiences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {pkgs.map(p => (
            <div key={p.id} className={p.isPopular ? 'md:-mt-8 md:mb-8' : ''}>
              <PackageCard {...p} />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="ghost">View All Packages</Button>
        </div>
      </div>
    </section>
  );
};
