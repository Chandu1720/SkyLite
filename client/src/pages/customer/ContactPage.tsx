import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useSettings } from '../../hooks/useSettings';
import { formatTime12h } from '@skylite/shared';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occasion: 'Birthday Celebration',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const businessName = settings?.businessName || 'SkyLite Private Theatre';
  const businessPhone = settings?.businessPhone || '+91 9876543210';
  const businessEmail = settings?.businessEmail || 'hello@skylite.com';
  const whatsappNumber = settings?.whatsappNumber || '+91 9876543210';
  const address = settings?.address || '123 Premium Mall, 4th Floor, City Center';
  const googleMapsUrl = settings?.googleMapsUrl || 'https://maps.google.com';
  const openingTime = settings?.openingTime ? formatTime12h(settings.openingTime) : '10:00 AM';
  const closingTime = settings?.closingTime ? formatTime12h(settings.closingTime) : '10:00 PM';

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast('error', 'Please provide your name and mobile number.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast('success', 'Thank you! We received your message and will contact you shortly.');

      // Also open WhatsApp with pre-filled message
      const text = `Hi ${businessName}, I am ${formData.name}. I'm interested in booking for ${formData.occasion}. Note: ${formData.message || 'Please share more details.'}`;
      const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> We are here to help
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4"
          >
            Get In Touch With <span className="bg-gradient-to-r from-[#F7E7B4] via-brand-gold to-brand-accent bg-clip-text text-transparent">SkyLite</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-body text-sm sm:text-base leading-relaxed"
          >
            Have a custom celebration request, bulk booking inquiry, or want to visit our venue? Reach out to our concierge team anytime.
          </motion.p>
        </div>

        {/* Dedicated Event Coordinators & Booking Desk Section */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-1 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              Direct Event Managers & Booking Concierge
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Speak directly with our dedicated celebration hosts for instant slot confirmation and customized decoration packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coordinator 1: Phaneendra */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-brand-dark/95 via-brand-dark to-black/80 border-2 border-brand-gold/30 hover:border-brand-gold p-6 sm:p-7 rounded-3xl shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-gold/20 to-brand-accent/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-lg shadow-brand-gold/10 group-hover:scale-105 transition-transform">
                    <span className="font-heading font-bold text-xl">PH</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/15 px-2.5 py-0.5 rounded-full mb-1">
                      Event Specialist
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-white">Phaneendra</h3>
                    <p className="text-xs text-gray-400">Bookings, Surprise Decor & Proposals</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 block">Mobile Number</span>
                  <a href="tel:8008292789" className="text-lg font-mono font-bold text-white hover:text-brand-gold transition-colors">
                    +91 80082 92789
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                <a
                  href="tel:8008292789"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-dark font-bold text-xs sm:text-sm border border-brand-gold/30 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Phaneendra</span>
                </a>
                <a
                  href="https://wa.me/918008292789?text=Hi%20Phaneendra,%20I%20would%20like%20to%20inquire%20about%20booking%20SkyLite%20Private%20Theatre."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-brand-dark font-bold text-xs sm:text-sm border border-emerald-500/30 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>

            {/* Coordinator 2: Praveen */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-brand-dark/95 via-brand-dark to-black/80 border-2 border-brand-gold/30 hover:border-brand-gold p-6 sm:p-7 rounded-3xl shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-gold/20 to-brand-accent/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-lg shadow-brand-gold/10 group-hover:scale-105 transition-transform">
                    <span className="font-heading font-bold text-xl">PR</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/15 px-2.5 py-0.5 rounded-full mb-1">
                      Event Specialist
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-white">Praveen</h3>
                    <p className="text-xs text-gray-400">Celebration Host & Venue Operations</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 block">Mobile Number</span>
                  <a href="tel:9985631121" className="text-lg font-mono font-bold text-white hover:text-brand-gold transition-colors">
                    +91 99856 31121
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                <a
                  href="tel:9985631121"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-dark font-bold text-xs sm:text-sm border border-brand-gold/30 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Praveen</span>
                </a>
                <a
                  href="https://wa.me/919985631121?text=Hi%20Praveen,%20I%20would%20like%20to%20inquire%20about%20booking%20SkyLite%20Private%20Theatre."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-brand-dark font-bold text-xs sm:text-sm border border-emerald-500/30 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* General Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {/* Card 1: Phone */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-brand-dark/90 backdrop-blur-md border border-gray-800 hover:border-brand-gold/50 p-6 rounded-3xl shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">Direct Lines</h3>
              <p className="text-xs text-gray-400 mb-3">Instant booking assistance</p>
            </div>
            <div className="space-y-1">
              <a href="tel:8008292789" className="font-semibold text-xs text-brand-gold hover:text-white transition-colors block">
                Phaneendra: +91 80082 92789
              </a>
              <a href="tel:9985631121" className="font-semibold text-xs text-brand-gold hover:text-white transition-colors block">
                Praveen: +91 99856 31121
              </a>
            </div>
          </motion.div>

          {/* Card 2: WhatsApp */}
          <motion.a
            href="https://wa.me/918008292789?text=Hi%20SkyLite%20Private%20Theatre,%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            className="bg-brand-dark/90 backdrop-blur-md border border-gray-800 hover:border-green-500/50 p-6 rounded-3xl shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">WhatsApp Concierge</h3>
              <p className="text-xs text-gray-400 mb-3">Instant chat & decoration menus</p>
            </div>
            <span className="font-semibold text-sm text-green-400 group-hover:text-white transition-colors flex items-center gap-1">
              Chat on WhatsApp <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </motion.a>

          {/* Card 3: Email */}
          <motion.a
            href={`mailto:${businessEmail}`}
            whileHover={{ y: -4 }}
            className="bg-brand-dark/90 backdrop-blur-md border border-gray-800 hover:border-brand-gold/50 p-6 rounded-3xl shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">Email Support</h3>
              <p className="text-xs text-gray-400 mb-3">For corporate & bulk bookings</p>
            </div>
            <span className="font-semibold text-sm text-blue-400 group-hover:text-white transition-colors break-all">
              {businessEmail}
            </span>
          </motion.a>

          {/* Card 4: Hours */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-brand-dark/90 backdrop-blur-md border border-gray-800 p-6 rounded-3xl shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-rose/10 border border-brand-rose/20 flex items-center justify-center text-brand-rose mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-1">Operating Hours</h3>
              <p className="text-xs text-gray-400 mb-3">Open 7 days a week</p>
            </div>
            <span className="font-semibold text-sm text-gray-200">
              {openingTime} — {closingTime}
            </span>
          </motion.div>
        </div>

        {/* Main Content: Form + Venue Location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-brand-dark border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="border-b border-gray-800 pb-4 mb-6">
              <h2 className="text-2xl font-heading font-bold text-white mb-1">Send Us a Message</h2>
              <p className="text-xs text-gray-400">Fill out your details below and our team will get back to you within 30 minutes.</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">Message Dispatched!</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our celebration planner is reviewing your request.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-darker border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-darker border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-darker border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Occasion / Celebration Type
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full bg-brand-darker border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-gold focus:outline-none transition-colors"
                    >
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Anniversary Special">Anniversary Special</option>
                      <option value="Romantic Date Night">Romantic Date Night</option>
                      <option value="Proposal Setup">Proposal Setup</option>
                      <option value="Family Movie Screening">Family Movie Screening</option>
                      <option value="Binge Watch / Gaming">Binge Watch / Gaming</option>
                      <option value="Other Inquiries">Other Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Special Requests / Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your preferred date, number of guests, cake flavors, or custom themes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-brand-darker border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={submitting}
                    className="font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Connecting...' : 'Send Inquiry via WhatsApp'}</span>
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Venue Location & Direction */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-dark border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white">Visit Our Theatre</h3>
                    <p className="text-xs text-gray-400">Convenient location with ample parking</p>
                  </div>
                </div>

                <div className="bg-brand-darker p-4 rounded-2xl border border-gray-800/80 mb-6 space-y-2">
                  <span className="text-xs text-brand-gold font-bold uppercase tracking-wider block">Address</span>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">
                    {address}
                  </p>
                </div>

                {/* Map Interactive Box */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-brand-darker aspect-[16/9] mb-6 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                  <div className="text-center p-4 relative z-10 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>
                    <span className="text-xs font-semibold text-white block">{businessName}</span>
                    <span className="text-[11px] text-gray-400 block">Click below to open Google Maps navigation</span>
                  </div>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="secondary"
                  fullWidth
                  className="font-bold flex items-center justify-center gap-2 border-gray-700 hover:border-brand-gold/50"
                >
                  <ExternalLink className="w-4 h-4 text-brand-gold" />
                  <span>Get Directions on Google Maps</span>
                </Button>
              </a>
            </div>

            {/* Quick Booking CTA Banner */}
            <div className="bg-gradient-to-br from-brand-dark via-brand-gold/10 to-brand-dark border border-brand-gold/30 rounded-3xl p-6 shadow-xl text-center space-y-3">
              <Sparkles className="w-6 h-6 text-brand-gold mx-auto" />
              <h4 className="font-heading font-bold text-lg text-white">Ready to Book Your Slot?</h4>
              <p className="text-xs text-gray-300 max-w-xs mx-auto">
                Reserve your hall and celebration package in under 2 minutes with live slot selection.
              </p>
              <Link to="/book" className="block pt-1">
                <Button variant="primary" size="sm" fullWidth className="font-bold">
                  Book Slot Online Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;