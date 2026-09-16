import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileCheck, Shield, Users, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
              Terms & Conditions
            </h1>
            <p className="text-gray-400 text-sm">Last updated: September 2026</p>
          </div>

          <div className="bg-brand-dark border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 text-sm text-gray-300 leading-relaxed font-body">
            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">1. Agreement to Terms</h3>
              <p>
                By booking a slot, using our online platform, or entering SkyLite Private Theatre premises, you agree to comply with and be bound by the following terms and operational conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">2. Guest Headcount & Capacity</h3>
              <p>
                Each private theatre hall has an approved maximum guest capacity stated during booking. For safety, acoustic comfort, and fire regulations, bookings must not exceed the specified maximum guest limit.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">3. Punctuality & Slot Timings</h3>
              <p>
                Screening slots run strictly according to the scheduled start and end times. Any late arrival by the customer cannot be compensated with slot extensions if subsequent bookings are scheduled.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">4. Venue Decorum & Care</h3>
              <p>
                Guests are requested to handle audio/video equipment, acoustic wall panels, projector systems, and furniture with care. Any intentional damage or vandalism will be assessed and billed to the primary booking customer.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">5. Prohibited Items & Activities</h3>
              <p>
                Smoking, vaping, fireworks/open flames, narcotics, and unlawful activities are strictly prohibited inside the premises. SkyLite reserves the right to terminate any session without refund in case of gross misconduct.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;