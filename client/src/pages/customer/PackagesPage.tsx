import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { packageApi } from '../../api/packages';
import { PackageCard } from '../../components/cards/PackageCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import type { PackageDTO } from '@skylite/shared';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packageApi
      .getAll()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 pt-28 pb-16 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-gold font-bold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Transparent Pricing
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mt-3 mb-3">
            Celebration <span className="text-brand-gold">Packages</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Choose from carefully curated celebration tiers complete with decor, private screening time, and hospitality.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LoadingSkeleton variant="card" count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(packages || []).map((pkg) => {
              const parsedFeatures: string[] = Array.isArray(pkg.features)
                ? pkg.features
                : typeof pkg.features === 'string'
                ? JSON.parse(pkg.features || '[]')
                : [];

              return (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  name={pkg.name}
                  price={pkg.price}
                  durationMinutes={pkg.durationMinutes}
                  features={parsedFeatures}
                  isPopular={pkg.displayOrder === 1}
                />
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PackagesPage;