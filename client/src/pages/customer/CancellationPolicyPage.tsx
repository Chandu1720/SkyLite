import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock, RefreshCw, AlertCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useSettings } from '../../hooks/useSettings';

export const CancellationPolicyPage: React.FC = () => {
  const { settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber || '+91 9876543210';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');

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
              SkyLite Customer Guarantees
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
              Cancellation & Rescheduling Policy
            </h1>
            <p className="text-gray-400 text-sm">Last updated: September 2026</p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-dark p-5 rounded-2xl border border-gray-800 space-y-2">
              <Clock className="w-6 h-6 text-brand-gold" />
              <h4 className="font-heading font-bold text-white text-base">Free Rescheduling</h4>
              <p className="text-xs text-gray-400">Allowed up to 24 hours prior to your slot time with zero fee.</p>
            </div>
            <div className="bg-brand-dark p-5 rounded-2xl border border-gray-800 space-y-2">
              <RefreshCw className="w-6 h-6 text-green-400" />
              <h4 className="font-heading font-bold text-white text-base">Advance Protection</h4>
              <p className="text-xs text-gray-400">Advance deposits are carried forward for up to 60 days on rescheduled slots.</p>
            </div>
            <div className="bg-brand-dark p-5 rounded-2xl border border-gray-800 space-y-2">
              <AlertCircle className="w-6 h-6 text-brand-rose" />
              <h4 className="font-heading font-bold text-white text-base">Last-Minute Notice</h4>
              <p className="text-xs text-gray-400">Cancellations under 12 hours cannot be refunded due to custom cake/decor preparation.</p>
            </div>
          </div>

          <div className="bg-brand-dark border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 text-sm text-gray-300 leading-relaxed font-body">
            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">1. Slot Reservation & Advance Deposits</h3>
              <p>
                To reserve a private theatre slot, an advance payment or full booking amount is processed online via UPI. This payment secures exclusive access to the hall and activates our event setup team.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">2. Rescheduling Guidelines</h3>
              <p>
                We understand that plans can change. You may reschedule your booking date or time slot free of charge by providing at least 24 hours notice. Your advance deposit will be applied directly to your newly selected slot.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">3. Cancellation & Refunds</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li><strong className="text-white">More than 24 Hours Notice:</strong> 100% advance converted into credit for future booking or refunded (minus 5% gateway charge).</li>
                <li><strong className="text-white">Between 12 to 24 Hours Notice:</strong> 50% credit provided for future reschedule.</li>
                <li><strong className="text-white">Less than 12 Hours Notice / No-Show:</strong> Advance is non-refundable as perishables (custom cakes, flowers) and slot blockage cannot be recovered.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-white">4. Force Majeure & Technical Faults</h3>
              <p>
                In the rare event of equipment failure, power outage, or government restrictions, SkyLite will offer an immediate 100% refund or priority rescheduling with a complimentary upgrade.
              </p>
            </section>
          </div>

          <div className="p-6 rounded-2xl bg-brand-dark border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-white text-base">Need to reschedule or cancel?</h4>
              <p className="text-xs text-gray-400">Our concierge is available on WhatsApp 7 days a week.</p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hi%20SkyLite,%20I%20would%20like%20to%20request%20rescheduling/cancellation%20for%20my%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="sm" className="font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Contact Concierge</span>
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;