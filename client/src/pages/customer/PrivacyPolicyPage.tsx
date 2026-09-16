import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-darker text-white pt-24 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-brand-gold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-2">
              Privacy & Data Security
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
              SkyLite Privacy Policy
            </h1>
            <p className="text-gray-400 text-sm">Last updated: September 2026</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-dark p-5 rounded-2xl border border-gray-800 space-y-2">
              <Lock className="w-6 h-6 text-brand-gold" />
              <h4 className="font-heading font-bold text-white text-base">Encrypted Data</h4>
              <p className="text-xs text-gray-400">All customer booking data and transactions are encrypted via SSL/TLS.</p>
            </div>
            <div className="bg-brand-dark p-5 rounded-2xl border border-gray-800 space-y-2">
              <EyeOff className="w-6 h-6 text-green-400" />
              <h4 className="font-heading font-bold text-white text-base">100% Privacy</h4>
              <p className="text-xs text-gray-400">We never sell or share your phone number, email, or guest details.</p>
            </div>
            <div className="bg-brand-dark p-5 rounded-2xl border border-gray-800 space-y-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              <h4 className="font-heading font-bold text-white text-base">In-Theatre Privacy</h4>
              <p className="text-xs text-gray-400">No cameras or surveillance inside the screening halls during your private session.</p>
            </div>
          </div>

          <div className="bg-brand-dark border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 text-sm text-gray-300 leading-relaxed font-body">
            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">1. Information We Collect</h3>
              <p>
                When reserving a private theatre slot, we collect your name, mobile phone number, optional email address, guest headcount, and special celebration requests. This information is used strictly to fulfill your booking, send WhatsApp confirmation passes, and prepare your event.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">2. Payment Security</h3>
              <p>
                All online payments are made directly through UPI apps (Google Pay, PhonePe, Paytm, BHIM) using banking standard encryption. SkyLite never stores your bank account passwords, UPI PINs, or card CVVs.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">3. In-Theatre Screening Privacy</h3>
              <p>
                We uphold the highest standard of guest privacy. Screening lounges are 100% private for the duration of your slot. No internal cameras or monitoring devices operate inside the private cinema rooms.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">4. Contact & Communications</h3>
              <p>
                We use WhatsApp and SMS strictly for booking confirmation passes, slot reminders, and concierge coordination. You will never receive unsolicited spam promotions.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;