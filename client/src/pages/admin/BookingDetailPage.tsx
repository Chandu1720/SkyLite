import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate, formatTime12h } from '@skylite/shared';
import type { BookingDTO, PaymentMethod } from '@skylite/shared';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Gift,
  CreditCard,
  MessageSquare,
  DollarSign,
  Wallet,
  Building2,
  Tag,
  Receipt,
  FileCheck,
} from 'lucide-react';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Collect balance modal state
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectMethod, setCollectMethod] = useState<PaymentMethod>('CASH');
  const [collectRef, setCollectRef] = useState('');

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await adminApi.getBooking(id);
      setBooking(data);
      if (data) {
        setCollectAmount(data.remainingAmount || 0);
      }
    } catch (err: any) {
      toast('error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!id || !window.confirm('Are you sure you want to cancel this booking? The slot will be released.')) return;
    try {
      setProcessing(true);
      await adminApi.cancelBooking(id);
      toast('success', 'Booking cancelled and slot released.');
      fetchBooking();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setProcessing(false);
    }
  };

  const handleVerifyLatestPayment = async () => {
    if (!booking?.payments || booking.payments.length === 0) return;
    const pendingPayment = booking.payments.find(p => p.status === 'UNDER_VERIFICATION') || booking.payments[booking.payments.length - 1];
    try {
      setProcessing(true);
      await adminApi.verifyPayment(pendingPayment.id);
      toast('success', 'Payment verified! Booking confirmed.');
      fetchBooking();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Verification failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCollectBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !booking) return;
    try {
      setProcessing(true);
      await adminApi.collectBalance(id, {
        paymentMethod: collectMethod,
        amount: Number(collectAmount),
        transactionRef: collectRef.trim() || undefined,
      });
      toast('success', `Remaining balance of ${formatCurrency(collectAmount)} collected successfully!`);
      setIsCollectModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to collect remaining balance');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading booking information...</div>;
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-heading text-white mb-2">Booking Not Found</h2>
        <Button variant="secondary" onClick={() => navigate('/admin/bookings')}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="p-2 bg-brand-dark border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">Reference: {booking.bookingReference}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  booking.bookingSource === 'OFFLINE_WALKIN'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}
              >
                {booking.bookingSource === 'OFFLINE_WALKIN' ? 'Walk-in (Offline)' : 'Online Booking'}
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Booking Overview</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={booking.bookingStatus} type="booking" />
          <StatusBadge status={booking.paymentStatus} type="payment" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-heading font-bold text-brand-gold border-b border-gray-800 pb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Guest Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">Customer Name</span>
                <span className="font-semibold text-white text-sm">{booking.customer?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Mobile Number</span>
                <span className="font-semibold text-white text-sm flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-gold" /> {booking.customer?.phone}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Email Address</span>
                <span className="text-gray-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-500" /> {booking.customer?.email || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Guests Attending</span>
                <span className="text-gray-300 font-semibold">{booking.guestCount} Guests</span>
              </div>
            </div>

            {booking.specialRequest && (
              <div className="pt-2 border-t border-gray-800 text-xs">
                <span className="text-gray-500 block mb-1">Special Requests:</span>
                <p className="text-gray-300 bg-brand-darker p-3 rounded-lg border border-gray-800 italic">
                  "{booking.specialRequest}"
                </p>
              </div>
            )}
          </div>

          {/* Screening info */}
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-heading font-bold text-brand-gold border-b border-gray-800 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Event & Package Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">Theatre Hall</span>
                <span className="font-semibold text-white text-sm">{booking.theatre?.name || 'Main Hall'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Date & Time</span>
                <span className="font-semibold text-white text-sm">
                  {formatDate(booking.date)} ({formatTime12h(booking.startTime)} - {formatTime12h(booking.endTime)})
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Occasion</span>
                <span className="text-gray-300 font-medium">{booking.occasion?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Selected Package</span>
                <span className="text-gray-300 font-medium">{booking.package?.name}</span>
              </div>
            </div>

            {booking.bookingAddons && booking.bookingAddons.length > 0 && (
              <div className="pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-400 block mb-2 font-semibold">Included Add-on Services:</span>
                <div className="space-y-1 text-xs">
                  {booking.bookingAddons.map((addon, idx) => (
                    <div key={idx} className="flex justify-between bg-brand-darker px-3 py-2 rounded-lg border border-gray-800">
                      <span className="text-gray-300">{addon.addonName}</span>
                      <span className="font-medium text-brand-gold">{formatCurrency(addon.addonPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Transactions & Receipts */}
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-heading font-bold text-brand-gold border-b border-gray-800 pb-2 flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Payment History & Receipts
            </h2>
            {(!booking.payments || booking.payments.length === 0) ? (
              <p className="text-xs text-gray-500 py-4 text-center">No payment transactions recorded.</p>
            ) : (
              <div className="space-y-3">
                {booking.payments.map((p, idx) => (
                  <div key={p.id || idx} className="bg-brand-darker p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{formatCurrency(p.amount)}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-800 text-gray-300">
                          {p.paymentType === 'ADVANCE' ? 'Advance Payment' : p.paymentType === 'REMAINING_BALANCE' ? 'Balance Payment' : 'Full Payment'}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-brand-gold/10 text-brand-gold">
                          Method: {p.paymentMethod || 'UPI'}
                        </span>
                      </div>
                      {p.upiTransactionRef && (
                        <div className="text-gray-400 font-mono text-[11px]">
                          Ref / UTR: <span className="text-white font-semibold">{p.upiTransactionRef}</span>
                        </div>
                      )}
                      <div className="text-gray-500 text-[10px]">
                        Recorded: {formatDate(p.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} type="payment" />
                      {p.screenshotUrl && (
                        <a
                          href={p.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] bg-gray-800 text-gray-300 hover:text-white rounded border border-gray-700"
                        >
                          View Receipt
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Actions & Pricing */}
        <div className="space-y-6">
          {/* Actions card */}
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-base font-heading font-bold text-white border-b border-gray-800 pb-2">
              Staff Operations
            </h2>

            {booking.paymentStatus === 'UNDER_VERIFICATION' && (
              <Button
                variant="primary"
                size="sm"
                disabled={processing}
                onClick={handleVerifyLatestPayment}
                className="w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold"
              >
                <CheckCircle className="w-4 h-4" /> Verify Payment & Confirm
              </Button>
            )}

            {booking.remainingAmount > 0 && booking.remainingPaymentStatus === 'PENDING' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCollectAmount(booking.remainingAmount);
                  setIsCollectModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-brand-gold text-brand-dark font-bold hover:bg-brand-accent"
              >
                <DollarSign className="w-4 h-4" /> Collect Remaining Balance ({formatCurrency(booking.remainingAmount)})
              </Button>
            )}

            {booking.bookingStatus !== 'CANCELLED' && (
              <Button
                variant="danger"
                size="sm"
                disabled={processing}
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Cancel Booking
              </Button>
            )}

            <a
              href={`https://wa.me/${booking.customer?.phone}?text=Hi%20${encodeURIComponent(booking.customer?.name || '')},%20Greetings%20from%20SkyLite%20Private%20Theatre%20regarding%20booking%20${booking.bookingReference}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs bg-gray-800 hover:bg-gray-700 text-green-400 rounded-lg transition-colors font-medium border border-gray-700"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Guest
            </a>
          </div>

          {/* Pricing summary */}
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-base font-heading font-bold text-brand-gold border-b border-gray-800 pb-2">
              Payment Breakdown
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Payment Mode</span>
                <span className="text-white font-semibold">{booking.paymentType === 'ADVANCE' ? 'Advance Payment' : 'Full Payment'}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (18% GST)</span>
                <span className="text-white font-medium">{formatCurrency(booking.tax)}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Discount ({booking.discountCode || 'PROMO'})
                  </span>
                  <span>-{formatCurrency(booking.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-800 pt-2 flex justify-between font-heading text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="text-brand-gold">{formatCurrency(booking.total)}</span>
              </div>

              {/* Advance & Remaining Balance Details */}
              {booking.paymentType === 'ADVANCE' && (
                <div className="mt-3 pt-3 border-t border-gray-800/80 space-y-2">
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Advance Amount Paid</span>
                    <span>{formatCurrency(booking.advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-yellow-400">Balance Remaining</span>
                    <span className={booking.remainingPaymentStatus === 'PENDING' ? 'text-yellow-400 font-bold' : 'text-green-400'}>
                      {formatCurrency(booking.remainingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                    <span>Balance Status</span>
                    <span className={`font-semibold ${
                      booking.remainingPaymentStatus === 'PAID_OFFLINE' || booking.remainingPaymentStatus === 'PAID_ONLINE'
                        ? 'text-green-400'
                        : booking.remainingPaymentStatus === 'PENDING'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}>
                      {booking.remainingPaymentStatus === 'PAID_OFFLINE'
                        ? 'PAID AT VENUE'
                        : booking.remainingPaymentStatus === 'PAID_ONLINE'
                        ? 'PAID ONLINE'
                        : booking.remainingPaymentStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Collect Remaining Balance */}
      <Modal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        title="Collect Remaining Balance"
      >
        <form onSubmit={handleCollectBalance} className="space-y-4">
          <div className="bg-brand-darker p-3.5 rounded-xl border border-gray-800 space-y-1 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Booking Reference:</span>
              <span className="font-mono text-white font-semibold">{booking.bookingReference}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Customer:</span>
              <span className="text-white font-semibold">{booking.customer?.name} ({booking.customer?.phone})</span>
            </div>
            <div className="flex justify-between text-yellow-400 font-bold pt-1 border-t border-gray-800">
              <span>Outstanding Due:</span>
              <span>{formatCurrency(booking.remainingAmount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Amount to Collect (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              max={booking.remainingAmount}
              value={collectAmount}
              onChange={(e) => setCollectAmount(Number(e.target.value))}
              className="w-full bg-brand-darker border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CASH', label: 'Cash' },
                { id: 'CARD', label: 'Card / POS' },
                { id: 'OFFLINE_UPI', label: 'Venue UPI' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setCollectMethod(m.id as PaymentMethod)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    collectMethod === m.id
                      ? 'bg-brand-gold/15 border-brand-gold text-brand-gold'
                      : 'bg-brand-darker border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Reference / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Cash collected by Front Desk / POS Invoice #123"
              value={collectRef}
              onChange={(e) => setCollectRef(e.target.value)}
              className="w-full bg-brand-darker border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCollectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={processing || collectAmount <= 0}
            >
              {processing ? 'Recording...' : `Confirm Payment of ${formatCurrency(collectAmount)}`}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingDetailPage;