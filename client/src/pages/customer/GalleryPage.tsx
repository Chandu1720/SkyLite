import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Camera, Heart, Film, ArrowRight, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface GalleryItem {
  id: string;
  title: string;
  category: 'birthdays' | 'anniversaries' | 'theatres' | 'proposals' | 'datenights';
  categoryLabel: string;
  imageUrl: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Neon Glow Birthday Celebration',
    category: 'birthdays',
    categoryLabel: 'Birthdays',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200',
    description: 'Custom neon birthday arch with pastel balloons and gourmet chocolate cake setup.',
  },
  {
    id: '2',
    title: 'Grand Audiophile Screening Hall',
    category: 'theatres',
    categoryLabel: 'Theatres',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200',
    description: 'Plush acoustic recliners, 4K HDR laser projection, and 7.1 Dolby Atmos sound.',
  },
  {
    id: '3',
    title: 'Candlelight Romantic Date Night',
    category: 'datenights',
    categoryLabel: 'Date Nights',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
    description: 'LED candle walkway with red rose petals, fairy lights, and private screening.',
  },
  {
    id: '4',
    title: 'Magical Marry Me Proposal Setup',
    category: 'proposals',
    categoryLabel: 'Proposals',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
    description: 'Illuminated MARRY ME marquee letters, floral arch, and custom memory video playback.',
  },
  {
    id: '5',
    title: 'Golden Jubilee Anniversary Lounge',
    category: 'anniversaries',
    categoryLabel: 'Anniversaries',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200',
    description: 'Champagne gold decor themes, personalized photo montage, and celebration bouquets.',
  },
  {
    id: '6',
    title: 'Private Friends Movie Screening',
    category: 'theatres',
    categoryLabel: 'Theatres',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200',
    description: 'Comfortable group seating, unlimited snacks, and PlayStation 5 gaming compatibility.',
  },
  {
    id: '7',
    title: 'Fairy Tale Birthday Fantasy',
    category: 'birthdays',
    categoryLabel: 'Birthdays',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200',
    description: 'Lavender and silver thematic decor with fog entry and custom countdown video.',
  },
  {
    id: '8',
    title: 'Intimate Proposal with Ring Box Reveal',
    category: 'proposals',
    categoryLabel: 'Proposals',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200',
    description: 'Surprise on-screen question projection followed by sparkler celebration.',
  },
];

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'birthdays', label: 'Birthdays' },
    { id: 'anniversaries', label: 'Anniversaries' },
    { id: 'datenights', label: 'Date Nights' },
    { id: 'proposals', label: 'Proposals' },
    { id: 'theatres', label: 'Theatre Halls' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-darker text-white pt-24 pb-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Moments of Joy
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4"
          >
            Celebration <span className="bg-gradient-to-r from-[#F7E7B4] via-brand-gold to-brand-accent bg-clip-text text-transparent">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-body text-sm sm:text-base leading-relaxed"
          >
            Explore real snapshots of decorations, birthday surprises, acoustic private lounges, and romantic date setups at SkyLite.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-gold text-brand-dark shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-105'
                  : 'bg-brand-dark border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-brand-dark border border-gray-800 hover:border-brand-gold/50 shadow-xl relative"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  <span className="absolute top-3.5 left-3.5 bg-brand-dark/80 backdrop-blur-md text-brand-gold text-[11px] font-bold px-3 py-1 rounded-full border border-brand-gold/20">
                    {item.categoryLabel}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-gold transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-body line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA Card */}
        <div className="mt-16 bg-gradient-to-r from-brand-dark via-brand-gold/10 to-brand-dark border border-brand-gold/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center max-w-3xl mx-auto space-y-4">
          <Sparkles className="w-8 h-8 text-brand-gold animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Create Your Own Unforgettable Memories
          </h2>
          <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
            Choose your favourite occasion theme, customize your cakes and decor, and book your private theatre in 2 minutes.
          </p>
          <div className="pt-2">
            <Link to="/book">
              <Button variant="primary" size="lg" className="font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                <span>Book Your Private Screening Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Modal Lightbox */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setActiveItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-brand-dark border border-gray-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-brand-darker/80 text-gray-300 hover:text-white border border-gray-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="aspect-[16/10] w-full relative">
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
                      {activeItem.categoryLabel}
                    </span>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">
                      {activeItem.title}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-lg">
                      {activeItem.description}
                    </p>
                  </div>
                  <Link to="/book" className="shrink-0">
                    <Button variant="primary" size="md" className="font-bold flex items-center gap-1.5">
                      <span>Book Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPage;