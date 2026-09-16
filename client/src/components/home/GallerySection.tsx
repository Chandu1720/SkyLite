import React from 'react';
import { Button } from '../ui/Button';

export const GallerySection = () => {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Moments at <span className="text-brand-gold">SkyLite</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-brand-darker/50" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <span className="text-white font-medium">View</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button variant="secondary">View Full Gallery</Button>
        </div>
      </div>
    </section>
  );
};
