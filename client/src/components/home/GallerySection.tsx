import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { galleryApi } from '../../api/gallery';
import type { GalleryImageDTO } from '@skylite/shared';

const FALLBACK_SEEDS = [
  {
    id: '1',
    title: 'Neon Glow Birthday Celebration',
    category: 'birthdays',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200',
  },
  {
    id: '2',
    title: 'Grand Audiophile Screening Hall',
    category: 'theatres',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200',
  },
  {
    id: '3',
    title: 'Candlelight Romantic Date Night',
    category: 'datenights',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
  },
  {
    id: '4',
    title: 'Magical Marry Me Proposal Setup',
    category: 'proposals',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
  },
  {
    id: '5',
    title: 'Golden Jubilee Anniversary Lounge',
    category: 'anniversaries',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200',
  },
  {
    id: '6',
    title: 'Private Friends Movie Screening',
    category: 'theatres',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200',
  },
];

export const GallerySection: React.FC = () => {
  const [images, setImages] = useState<any[]>(FALLBACK_SEEDS);

  useEffect(() => {
    galleryApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setImages(data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Real Ambiance & Decor
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-3">
            Moments at <span className="text-brand-gold">SkyLite</span>
          </h2>
          <p className="text-gray-400 font-body text-sm sm:text-base">
            Take a peek at actual celebration setups, premium recliner lounges, and 4K cinema rooms.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {images.map((item) => (
            <Link
              to="/gallery"
              key={item.id}
              className="aspect-square bg-gray-950 rounded-2xl overflow-hidden relative group border border-gray-800/80 hover:border-brand-gold/50 transition-all duration-300 shadow-xl"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Category pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-brand-gold backdrop-blur-md border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Title & View CTA */}
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <h3 className="text-xs sm:text-sm font-heading font-bold text-white line-clamp-1 group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h3>
                <span className="text-[11px] text-gray-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  View Full Gallery <ArrowRight className="w-3 h-3 text-brand-gold" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/gallery">
            <Button variant="secondary" className="gap-2">
              <span>Explore All Gallery Photos</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
