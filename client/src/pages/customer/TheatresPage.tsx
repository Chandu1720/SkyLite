import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { theatreApi } from '../../api/theatres';
import { TheatreCard } from '../../components/cards/TheatreCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import type { TheatreDTO } from '@skylite/shared';

export const TheatresPage: React.FC = () => {
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    theatreApi
      .getAll()
      .then((data) => setTheatres(Array.isArray(data) ? data : []))
      .catch(() => setTheatres([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 pt-28 pb-16 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-gold font-bold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Exclusive Screening Halls
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mt-3 mb-3">
            Our Private <span className="text-brand-gold">Theatres</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Immerse yourself in plush recliner seating, 4K laser projection, and explosive Dolby surround sound.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LoadingSkeleton variant="card" count={2} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(theatres || []).map((t) => (
              <TheatreCard
                key={t.id}
                id={t.id}
                name={t.name}
                capacity={t.capacity}
                basePrice={t.basePrice}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TheatresPage;