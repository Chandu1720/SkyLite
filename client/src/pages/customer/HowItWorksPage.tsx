import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Layers,
  Gift,
  CreditCard,
  Tv,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: Layers,
      title: 'Choose Your Occasion & Hall',
      subtitle: 'Personalized to your event',
      description: 'Select your celebration theme (Birthday, Anniversary, Romantic Date, Movie Night, or Proposal) and pick the ideal private theatre hall with the seating capacity you need.',
      perks: ['Multiple acoustic lounge options', 'Thematic celebration decor', 'Exclusive 100% private access'],
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Select Live Date & Time Slot',
      subtitle: 'Real-time slot availability',
      description: 'Pick your preferred date from our 30-day interactive calendar and select a convenient 2-3 hour slot. Every slot includes buffer time for thorough sanitization before your arrival.',
      perks: ['Morning, afternoon & evening slots', 'Instant slot lock protection', 'Sanitized & cooled before entry'],
    },
    {
      number: '03',
      icon: Gift,
      title: 'Pick Celebration Packages & Add-ons',
      subtitle: 'Cakes, flowers, decor & dining',
      description: 'Elevate your celebration by choosing gourmet cakes (Chocolate Truffle, Red Velvet, etc.), luxury flower bouquets, photo sparklers, snacks, or extra celebration hours.',
      perks: ['Custom balloon & neon decoration', 'Candlelight & rose petal pathways', 'Photography & photo shoot options'],
    },
    {
      number: '04',
      icon: CreditCard,
      title: 'Pay Advance or Full Online via UPI',
      subtitle: 'Fast, secure & flexible',
      description: 'Reserve your slot instantly by paying a small advance deposit online via UPI QR code or pay in full. The remaining balance (if any) can be settled at the reception upon arrival.',
      perks: ['Instant UPI QR code generated', 'Strict UTR verification & receipt', 'Promo coupon discount support'],
    },
    {
      number: '05',
      icon: Tv,
      title: 'Arrive & Experience VIP Cinema',
      subtitle: 'Your private theatre awaits',
      description: 'Walk into your pre-decorated private theatre with cold air conditioning, immersive 4K laser projection, Dolby Atmos surround sound, and gourmet snacks ready for you.',
      perks: ['Stream your Netflix, Prime, YouTube or OTT', 'Connect your laptop / PS5 / HDMI', 'Dedicated concierge assistance'],
    },
  ];

  const faqs = [
    {
      q: 'Can we connect our own OTT accounts or PlayStation?',
      a: 'Yes! You can stream your own Netflix, Prime Video, Disney+ Hotstar, YouTube, or connect via HDMI from your laptop / gaming console.',
    },
    {
      q: 'Can we bring our own cake or food items?',
      a: 'Yes, outside food and cakes are welcome. We also provide cakes, gourmet snacks, and beverages on-site.',
    },
    {
      q: 'How early should we arrive before our booked slot?',
      a: 'We recommend arriving 10-15 minutes prior to your slot time so our concierge can welcome your guests and start your screening promptly.',
    },
    {
      q: 'Is advance payment refundable if we need to reschedule?',
      a: 'You can reschedule your slot up to 24 hours before your booking time without any penalty by contacting our WhatsApp concierge.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-darker text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-gold/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simple 5-Step Process
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4"
          >
            How Booking Works At <span className="bg-gradient-to-r from-[#F7E7B4] via-brand-gold to-brand-accent bg-clip-text text-transparent">SkyLite</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-body text-sm sm:text-base leading-relaxed"
          >
            From choosing your favorite movie to customized decorations, booking your private celebration takes less than 2 minutes.
          </motion.p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-8 mb-20 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-brand-dark border border-gray-800 hover:border-brand-gold/40 rounded-3xl p-6 sm:p-8 shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Step badge & icon */}
                <div className="flex items-center md:flex-col gap-4 md:gap-2 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <span className="text-3xl font-heading font-black text-brand-gold/40 group-hover:text-brand-gold transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
                      {step.subtitle}
                    </span>
                    <h3 className="text-2xl font-heading font-bold text-white group-hover:text-brand-gold transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-300 font-body leading-relaxed">
                    {step.description}
                  </p>

                  {/* Perks chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {step.perks.map((perk, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-darker border border-gray-800 text-xs text-gray-300 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-gold" /> Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-400">Everything you need to know before visiting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, fIdx) => (
              <div key={fIdx} className="bg-brand-dark border border-gray-800 p-6 rounded-2xl space-y-2">
                <h4 className="font-heading font-bold text-base text-white">{faq.q}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-brand-dark via-brand-gold/15 to-brand-dark border border-brand-gold/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center space-y-4">
          <Sparkles className="w-10 h-10 text-brand-gold animate-bounce" />
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
            Ready to Celebrate in Privacy?
          </h2>
          <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
            Reserve your private theatre slot now with flexible payment and custom celebration setups.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Link to="/book">
              <Button variant="primary" size="lg" className="font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                <span>Book Your Private Slot</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/occasions">
              <Button variant="secondary" size="lg" className="font-semibold">
                Explore Occasion Themes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;