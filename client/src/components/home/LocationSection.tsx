import React from 'react';
import { ArrowUpRight, Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSettings } from '../../hooks/useSettings';

export const LocationSection = () => {
  const { settings } = useSettings();
  const address = settings?.address || 'Near Hanuman Temple, Pappannareddy Layout, Garvebhavi Palya, Bengaluru, Karnataka 560068';
  const mapUrl = settings?.googleMapsUrl || 'https://maps.google.com';
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const hours = settings ? `${settings.openingTime} - ${settings.closingTime}` : '10:00 - 22:00';

  return (
    <section className="relative overflow-hidden bg-brand-dark py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.12),transparent_32%),linear-gradient(120deg,#111116,#08080b)]" />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Your night starts here</p>
          <h2 className="font-heading text-4xl font-bold text-white md:text-6xl">Find <span className="text-brand-gold">Us</span></h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-gray-400">A private cinema experience, easy to reach in the heart of Bengaluru.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.4fr]">
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-sm md:p-8">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-brand-gold/40 bg-brand-gold/10">
                  {settings?.businessLogoUrl ? (
                    <img src={settings.businessLogoUrl} alt={`${settings.businessName || 'Business'} logo`} className="h-full w-full object-contain p-2" />
                  ) : (
                    <MapPin className="h-8 w-8 text-brand-gold" />
                  )}
                </div>
                <div>
                  <p className="font-heading text-xl font-bold text-white">{settings?.businessName || 'SkyLite Private Theatre'}</p>
                  <p className="text-xs uppercase tracking-wider text-brand-gold">Private cinema</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
                  <div>
                    <h4 className="mb-1 font-heading text-base text-white">Address</h4>
                    <p className="text-sm leading-6 text-gray-400">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
                  <div>
                    <h4 className="mb-1 font-heading text-base text-white">Hours</h4>
                    <p className="text-sm text-gray-400">Open daily: {hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
                  <div>
                    <h4 className="mb-1 font-heading text-base text-white">Contact & Bookings</h4>
                    <p className="text-sm leading-6 text-gray-300">
                      <a href="tel:8008292789" className="hover:text-brand-gold transition-colors block">Phaneendra: +91 80082 92789</a>
                      <a href="tel:9985631121" className="hover:text-brand-gold transition-colors block">Praveen: +91 99856 31121</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-fit">
              <Button variant="primary" className="flex items-center gap-2">Get Directions <ArrowUpRight className="h-4 w-4" /></Button>
            </a>
          </div>

          <div className="group relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-brand-darker shadow-2xl md:min-h-[480px]">
            <iframe title="SkyLite location map" src={mapEmbedUrl} className="absolute inset-0 h-full w-full border-0 grayscale-[0.15] transition duration-700 group-hover:grayscale-0" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl border border-white/15 bg-black/75 px-4 py-3 backdrop-blur-md">
              <Navigation className="h-4 w-4 text-brand-gold" />
              <span className="text-xs font-medium text-white">Navigate to {settings?.businessName || 'SkyLite'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
