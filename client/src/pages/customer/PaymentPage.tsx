import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { bookingApi } from '../../api/bookings';
import { useCountdown } from '../../hooks/useCountdown';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency, formatTime12h, formatDate } from '@skylite/shared';
import type { BookingDTO, UPIPaymentResponse } from '@skylite/shared';
import {
  QrCode,
  Smartphone,
  Copy,
  CheckCircle,
  AlertTriangle,
  Upload,
  MessageSquare,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [paymentData, setPaymentData] = useState<UPIPaymentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Form submission states
  const [upiRef, setUpiRef] = useState<string>('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Hold Timer countdown
  const { minutes, seconds, isExpired } = useCountdown(
    paymentData?.holdExpiresAt || booking?.holdExpiresAt || ''
  );

  useEffect(() => {
    if (!ref) return;

    const loadPaymentDetails = async () => {
      try {
        setLoading(true);
        const [bookingRes, upiRes] = await Promise.all([
          bookingApi.getByRef(ref),
          bookingApi.initiatePayment(ref),
        ]);
        setBooking(bookingRes);
        setPaymentData(upiRes);

        // If already in verification or confirmed, update UI
        if (
          bookingRes.bookingStatus === 'PAYMENT_VERIFICATION' ||
          bookingRes.bookingStatus === 'CONFIRMED'
        ) {
          setSubmitted(true);
        }
      } catch (err: any) {
        toast('error', err.response?.data?.error || 'Failed to initialize payment.');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentDetails();
  }, [ref]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast('success', 'UPI URI copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const isAdvancePayment = booking?.paymentType === 'ADVANCE' && (booking?.remainingAmount || 0) > 0;
  const advanceAmount = isAdvancePayment ? (booking?.advanceAmount || paymentData?.amount || 0) : (paymentData?.amount || 0);
  const remainingAmount = booking?.remainingAmount || 0;

  const validateClientUtr = (val: string) => {
    const clean = val.trim();
    return /^[0-9]{12}$/.test(clean) || /^[A-Za-z0-9]{12,22}$/.test(clean);
  };

  const handleSubmitConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = upiRef.trim();

    if (!ref || !cleanUtr) {
      toast('error', 'Please enter your 12-digit UPI transaction reference / UTR number');
      return;
    }

    if (!validateClientUtr(cleanUtr)) {
      toast('error', 'Please enter a valid 12-digit UPI UTR number or standard bank reference ID');
      return;
    }

    try {
      setSubmitting(true);
      const updated = await bookingApi.submitPaymentConfirmation(
        ref,
        { upiTransactionRef: cleanUtr },
        screenshotFile || undefined
      );
      setBooking(updated);
      setSubmitted(true);
      toast('success', 'Payment details submitted for verification!');
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to submit payment proof');
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-filled WhatsApp message
  const generateWhatsAppUrl = () => {
    if (!booking) return '#';
    const msg = `Hi SkyLite,

I have completed payment for my booking.

Booking ID:
${booking.bookingReference}

Occasion:
${booking.occasion?.name || 'Celebration'}

Date:
${formatDate(booking.date)}

Time:
${formatTime12h(booking.startTime)} – ${formatTime12h(booking.endTime)}

Package:
${booking.package?.name || 'Package'}

Paid Amount:
${formatCurrency(advanceAmount)}${isAdvancePayment ? ` (Advance - Remaining: ${formatCurrency(remainingAmount)})` : ''}

UPI Reference:
${upiRef || 'Submitted'}

Please verify and confirm my booking.`;

    return `https://wa.me/918008292789?text=${encodeURIComponent(msg)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-darker text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-heading">Generating secure UPI payment link...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking || !paymentData) {
    return (
      <div className="min-h-screen bg-brand-darker text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading mb-2">Booking Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">We could not load payment details for reference: {ref}</p>
          <Button variant="primary" onClick={() => navigate('/book')}>
            Start New Booking
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        {/* Header with Hold Timer */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            {isAdvancePayment ? 'Secure UPI Advance Payment' : 'Secure UPI Full Payment'}
          </span>
          <h1 className="text-3xl md:text-4xl font-heading text-white mt-3 mb-2">Complete Your Payment</h1>
          <p className="text-gray-400 text-sm">
            Booking Reference: <span className="text-brand-gold font-mono font-bold">{booking.bookingReference}</span>
          </p>

          {/* Hold Countdown Bar */}
          {!submitted && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-brand-dark border border-gray-800 text-sm">
              <Clock className="w-4 h-4 text-brand-gold animate-pulse" />
              <span className="text-gray-400">Slot Held For:</span>
              <span className={`font-mono font-bold text-base ${isExpired ? 'text-red-500' : 'text-brand-gold'}`}>
                {isExpired ? 'EXPIRED' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
              </span>
            </div>
          )}
        </div>

        {/* Expired Warning */}
        {isExpired && !submitted && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-semibold text-sm">Your slot hold has expired!</p>
            <p className="text-gray-400 text-xs mt-1">Please start a new booking to reserve an available slot.</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate('/book')}>
              Book Again
            </Button>
          </div>
        )}

        {/* Main Payment Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left / Top: Payment & QR Section */}
          <div className="md:col-span-7 bg-brand-dark rounded-2xl border border-gray-800 p-6 md:p-8 space-y-6">
            <div className="text-center border-b border-gray-800 pb-6">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">
                {isAdvancePayment ? 'Advance Payable Online Now' : 'Amount Due'}
              </span>
              <div className="text-4xl md:text-5xl font-heading font-bold text-brand-gold">
                {formatCurrency(paymentData.amount)}
              </div>

              {isAdvancePayment && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full">
                  <span>Balance Due at Venue: <strong>{formatCurrency(remainingAmount)}</strong></span>
                </div>
              )}
            </div>

            {/* Mobile Direct Pay Button */}
            <div className="space-y-3">
              <a
                href={paymentData.upiUri}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-brand-gold text-brand-dark font-heading font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-brand-gold/10"
              >
                <Smartphone className="w-5 h-5" />
                Pay {formatCurrency(paymentData.amount)} via UPI
              </a>
              <p className="text-center text-[11px] text-gray-400">
                Tap to open GPay, PhonePe, Paytm, or BHIM on your phone
              </p>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-800" />
              <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase">Or Scan QR Code</span>
              <div className="flex-grow border-t border-gray-800" />
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner max-w-xs mx-auto">
              <img
                src={paymentData.qrCodeDataUrl}
                alt="UPI Payment QR Code"
                className="w-56 h-56 object-contain"
              />
              <span className="text-xs text-gray-800 font-medium mt-1">Scan with any UPI Scanner</span>
            </div>

            {/* Copy URI option */}
            <div className="pt-2 text-center">
              <button
                onClick={() => copyToClipboard(paymentData.upiUri)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-gold transition-colors"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied UPI Link' : 'Copy Raw UPI Link'}
              </button>
            </div>
          </div>

          {/* Right / Bottom: Payment Confirmation & Verification Status */}
          <div className="md:col-span-5 space-y-6">
            {submitted ? (
              <div className="bg-brand-dark rounded-2xl border border-gray-800 p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading text-white">Payment Submitted</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Your reference number is under verification by SkyLite staff.
                  </p>
                </div>

                <div className="bg-brand-darker rounded-xl p-4 text-left border border-gray-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking Status:</span>
                    <StatusBadge status={booking.bookingStatus} type="booking" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Status:</span>
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </div>
                </div>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-500 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Continue on WhatsApp
                </a>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/booking/status?ref=${booking.bookingReference}&phone=${booking.customer?.phone || ''}`)}
                >
                  Track Booking Status
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitConfirmation} className="bg-brand-dark rounded-2xl border border-gray-800 p-6 space-y-4">
                <div className="border-b border-gray-800 pb-3">
                  <h3 className="text-lg font-heading text-white">Confirm Your Payment</h3>
                  <p className="text-xs text-gray-400">Enter transaction reference after completing UPI transfer</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    UPI Reference / UTR Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    placeholder="e.g. 423987123456"
                    className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold font-mono"
                  />
                  <span className="text-[11px] text-gray-500 block mt-1">
                    Found in your UPI app's transaction receipt (12 digits)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Payment Screenshot (Optional)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-lg p-4 cursor-pointer hover:border-brand-gold/50 bg-brand-darker/50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-500 mb-1" />
                    <span className="text-xs text-gray-400">
                      {screenshotFile ? screenshotFile.name : 'Upload Screenshot (JPG, PNG)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setScreenshotFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  disabled={isExpired}
                  className="w-full font-heading text-base py-3"
                >
                  I Have Completed Payment
                </Button>

                <div className="text-[11px] text-gray-500 space-y-1 pt-2">
                  <p className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    Booking confirmed after staff verifies the transaction reference.
                  </p>
                </div>
              </form>
            )}

            {/* Summary card */}
            <div className="bg-brand-darker/50 border border-gray-800 rounded-xl p-5 space-y-2 text-xs text-gray-300">
              <h4 className="font-heading text-sm text-brand-gold mb-2">Celebration Details</h4>
              <div className="flex justify-between">
                <span className="text-gray-500">Occasion:</span>
                <span>{booking.occasion?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span>{formatDate(booking.date)}, {formatTime12h(booking.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Package:</span>
                <span>{booking.package?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};