import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { bookingApi } from '../../api/bookings';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency, formatTime12h, formatDate } from '@skylite/shared';
import type { BookingDTO } from '@skylite/shared';
import { Search, Calendar, Clock, MapPin, Gift, CreditCard, MessageSquare, AlertCircle } from 'lucide-react';

export const BookingStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [ref, setRef] = useState(searchParams.get('ref') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async (refVal: string, phoneVal: string) => {
    if (!refVal || !phoneVal) return;
    try {
      setLoading(true);
      setError(null);
      const data = await bookingApi.lookupStatus(refVal.trim(), phoneVal.trim());
      setBooking(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No booking found matching these credentials.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const r = searchParams.get('ref');
    const p = searchParams.get('phone');
    if (r && p) {
      fetchStatus(r, p);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(ref, phone);
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-heading text-brand-gold mb-3">Check Booking Status</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Enter your booking reference ID and registered mobile number to check the live status.
          </p>
        </div>

        {/* Lookup Card */}
        <form onSubmit={handleSubmit} className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 mb-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Booking Reference ID</label>
              <input
                type="text"
                required
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. SKL-20260920-00125"
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Registered Mobile Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full font-heading text-base py-3">
            <Search className="w-4 h-4 mr-2" />
            Check Live Status
          </Button>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400 mb-10 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Booking Details View */}
        {booking && (
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Booking Reference</span>
                <span className="text-xl md:text-2xl font-mono font-bold text-brand-gold">{booking.bookingReference}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={booking.bookingStatus} type="booking" />
                <StatusBadge status={booking.paymentStatus} type="payment" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-gold" /> Date
                </span>
                <p className="text-sm font-medium text-white">{formatDate(booking.date)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-gold" /> Slot Time
                </span>
                <p className="text-sm font-medium text-white">
                  {formatTime12h(booking.startTime)} – {formatTime12h(booking.endTime)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" /> Theatre
                </span>
                <p className="text-sm font-medium text-white">{booking.theatre?.name || 'SkyLite Private Theatre'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-brand-gold" /> Occasion
                </span>
                <p className="text-sm font-medium text-white">{booking.occasion?.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-brand-gold" /> Package
                </span>
                <p className="text-sm font-medium text-white">{booking.package?.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-brand-gold" /> Total Amount
                </span>
                <p className="text-base font-heading font-bold text-brand-gold">{formatCurrency(booking.total)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-800 flex flex-wrap gap-4 items-center justify-between">
              {booking.paymentStatus !== 'PAID' && (
                <Button variant="primary" size="sm" onClick={() => navigate(`/payment/${booking.bookingReference}`)}>
                  View Payment QR / Link
                </Button>
              )}

              <a
                href={`https://wa.me/918008292789?text=Hi%20SkyLite,%20Checking%20status%20for%20Booking%20ID:%20${booking.bookingReference}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Need Help? Chat with Staff
              </a>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};