import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { occasionApi } from '../../api/occasions';
import { OccasionCard } from '../../components/cards/OccasionCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import type { OccasionDTO } from '@skylite/shared';

export const OccasionsPage: React.FC = () => {
  const [occasions, setOccasions] = useState<OccasionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    occasionApi
      .getAll()
      .then((data) => setOccasions(Array.isArray(data) ? data : []))
      .catch(() => setOccasions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 pt-28 pb-16 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-gold font-bold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Tailored Experiences
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mt-3 mb-3">
            Celebrate Every <span className="text-brand-gold">Occasion</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            From romantic candlelit proposals to high-energy birthday bashes, we transform your special moments into unforgettable cinema magic.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(occasions || []).map((occ) => (
              <OccasionCard
                key={occ.id}
                id={occ.id}
                name={occ.name}
                description={occ.description}
                imageUrl={occ.imageUrl || undefined}
                isFeatured={occ.isFeatured}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OccasionsPage;