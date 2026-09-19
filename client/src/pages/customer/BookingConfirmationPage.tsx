import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { bookingApi } from '../../api/bookings';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency, formatTime12h, formatDate } from '@skylite/shared';
import type { BookingDTO } from '@skylite/shared';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Gift,
  Download,
  Navigation,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ref) {
      bookingApi
        .getByRef(ref)
        .then(setBooking)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [ref]);

  const handleDownloadICS = () => {
    if (!booking) return;
    const dateStr = booking.date.split('T')[0].replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SkyLite Private Theatre//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:SkyLite Celebration - ${booking.occasion?.name || 'Private Screening'}
DESCRIPTION:Private theatre celebration at SkyLite. Booking Reference: ${booking.bookingReference}
LOCATION:${booking.theatre?.location || 'SkyLite Private Theatre'}
DTSTART:${dateStr}T${booking.startTime.replace(':', '')}00
DTEND:${dateStr}T${booking.endTime.replace(':', '')}00
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `skylite-booking-${booking.bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-darker text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-heading">Loading confirmation details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-brand-darker text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h2 className="text-2xl font-heading mb-4">Booking Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/book')}>
            Book Now
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Booking Confirmed</span>
          <h1 className="text-3xl md:text-5xl font-heading text-white mt-1 mb-2">You're All Set!</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Your private theatre celebration has been reserved. We look forward to hosting you!
          </p>
        </div>

        {/* Ticket Card */}
        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl" />

          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-800 pb-4">
            <div>
              <span className="text-xs text-gray-500 block">Booking Reference</span>
              <span className="text-xl font-mono font-bold text-brand-gold">{booking.bookingReference}</span>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={booking.bookingStatus} type="booking" />
              <StatusBadge status={booking.paymentStatus} type="payment" />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3 bg-brand-darker/60 p-3.5 rounded-xl border border-gray-800/80">
              <Calendar className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block">Date</span>
                <span className="font-semibold text-white">{formatDate(booking.date)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-brand-darker/60 p-3.5 rounded-xl border border-gray-800/80">
              <Clock className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block">Time Slot</span>
                <span className="font-semibold text-white">
                  {formatTime12h(booking.startTime)} – {formatTime12h(booking.endTime)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-brand-darker/60 p-3.5 rounded-xl border border-gray-800/80">
              <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block">Theatre Hall</span>
                <span className="font-semibold text-white">{booking.theatre?.name || 'Main Hall'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-brand-darker/60 p-3.5 rounded-xl border border-gray-800/80">
              <Gift className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block">Occasion & Package</span>
                <span className="font-semibold text-white">
                  {booking.occasion?.name} ({booking.package?.name})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-800">
            <Button variant="secondary" size="sm" onClick={handleDownloadICS} className="flex items-center justify-center gap-1.5">
              <Download className="w-4 h-4" /> Add to Calendar
            </Button>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <Navigation className="w-4 h-4 text-brand-gold" /> Get Directions
            </a>

            <a
              href={`https://wa.me/918008292789?text=Hi%20SkyLite,%20I%20have%20a%20question%20regarding%20my%20confirmed%20booking%20${booking.bookingReference}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};