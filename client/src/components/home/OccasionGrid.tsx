import React from 'react';
import { OccasionCard } from '../cards/OccasionCard';
import { Link } from 'react-router-dom';

export const OccasionGrid = () => {
  const occasions = [
    { id: '1', name: 'Birthday Celebration', description: 'Make their day special with a private screening and custom decor.', isFeatured: true },
    { id: '2', name: 'Anniversary Date', description: 'A romantic private movie date for you and your partner.' },
    { id: '3', name: 'Proposal Event', description: 'Pop the question in a magical, private setting.', isFeatured: true },
    { id: '4', name: 'Private Screening', description: 'Watch your favorite movies or shows with friends and family.' }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Celebrate <span className="text-brand-gold">Occasions</span></h2>
            <p className="text-gray-400 font-body">Tailored experiences for every special moment.</p>
          </div>
          <Link to="/occasions" className="hidden md:block text-brand-gold hover:text-white transition-colors font-medium pb-2 border-b border-brand-gold hover:border-white">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map(occ => (
            <OccasionCard key={occ.id} {...occ} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link to="/occasions" className="text-brand-gold border border-brand-gold px-6 py-3 rounded-md block w-full">
            View All Occasions
          </Link>
        </div>
      </div>
    </section>
  );
};
