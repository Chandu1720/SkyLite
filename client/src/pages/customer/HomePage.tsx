import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from '../../components/home/Hero';
import { WhySkyLite } from '../../components/home/WhySkyLite';
import { OccasionGrid } from '../../components/home/OccasionGrid';
import { TheatreExperience } from '../../components/home/TheatreExperience';
import { PackageShowcase } from '../../components/home/PackageShowcase';
import { AddOnGrid } from '../../components/home/AddOnGrid';
import { GallerySection } from '../../components/home/GallerySection';
import { HowItWorks } from '../../components/home/HowItWorks';
import { ReviewCarousel } from '../../components/home/ReviewCarousel';
import { FAQSection } from '../../components/home/FAQSection';
import { LocationSection } from '../../components/home/LocationSection';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />
      <main>
        <Hero />
        <WhySkyLite />
        <OccasionGrid />
        <TheatreExperience />
        <PackageShowcase />
        <AddOnGrid />
        <GallerySection />
        <HowItWorks />
        <ReviewCarousel />
        <FAQSection />
        <LocationSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};