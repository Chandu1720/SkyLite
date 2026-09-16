import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency, formatDate, formatTime12h } from '@skylite/shared';
import type { PaymentDTO } from '@skylite/shared';
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  User,
  Phone,
  Calendar,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid UPI Reference or Payment Not Received');
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPendingPayments();
      setPayments(data);
    } catch (err: any) {
      toast('error', 'Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to verify this payment and confirm the booking?')) return;
    try {
      setProcessing(true);
      await adminApi.verifyPayment(paymentId);
      toast('success', 'Payment verified! Booking confirmed and slot locked.');
      fetchPayments();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Verification failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenReject = (paymentId: string) => {
    setRejectingPaymentId(paymentId);
    setRejectReason('Invalid UPI Reference or Payment Not Received');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPaymentId) return;

    try {
      setProcessing(true);
      await adminApi.rejectPayment(rejectingPaymentId, rejectReason);
      toast('warning', 'Payment rejected and slot released back to available.');
      setRejectModalOpen(false);
      fetchPayments();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Payment Verification Queue</h1>
          <p className="text-gray-400 text-sm">
            Manual reconciliation queue for UPI payments submitted by customers ({payments.length} pending)
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchPayments} className="flex items-center gap-2">
          <Clock className="w-4 h-4" /> Refresh Queue
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading verification queue...</div>
      ) : payments.length === 0 ? (
        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-heading text-white mb-1">Queue is Empty</h3>
          <p className="text-xs text-gray-400">All customer UPI payments have been verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map((p) => {
            const booking = (p as any).booking;

            return (
              <div
                key={p.id}
                className="bg-brand-dark border-2 border-yellow-500/30 rounded-2xl p-6 shadow-xl space-y-4 hover:border-yellow-500/50 transition-colors"
              >
                <div className="flex justify-between items-start border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Booking Reference</span>
                    <span className="text-lg font-mono font-bold text-brand-gold">
                      {booking?.bookingReference || 'SKL-BOOKING'}
                    </span>
                  </div>
                  <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-pulse" /> Under Verification
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-brand-darker/60 p-4 rounded-xl border border-gray-800/80">
                  <div>
                    <span className="text-gray-500 block">Customer Name</span>
                    <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-brand-gold" />
                      {booking?.customer?.name || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Mobile Phone</span>
                    <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-brand-gold" />
                      {booking?.customer?.phone || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Occasion / Package</span>
                    <span className="text-gray-300 block mt-0.5">
                      {booking?.occasion?.name} • {booking?.package?.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Date & Time</span>
                    <span className="text-gray-300 block mt-0.5">
                      {booking ? `${formatDate(booking.date)} (${formatTime12h(booking.startTime)})` : '—'}
                    </span>
                  </div>
                </div>

                {/* Amount & Reference Details */}
                <div className="bg-brand-darker p-4 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        {booking?.paymentType === 'ADVANCE' ? 'Advance Received Online' : 'Total Amount Paid'}
                      </span>
                      <span className="text-2xl font-heading font-bold text-brand-gold">
                        {formatCurrency(p.amount)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Submitted UTR / Ref</span>
                      <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                        <span className="text-sm font-mono font-bold text-white bg-gray-800 px-2.5 py-1 rounded border border-gray-700">
                          {p.upiTransactionRef || 'Not Provided'}
                        </span>
                        {p.upiTransactionRef && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(p.upiTransactionRef || '');
                              toast('success', 'UTR copied!');
                            }}
                            className="p-1 text-gray-400 hover:text-brand-gold rounded bg-gray-800/80"
                            title="Copy UTR"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking?.paymentType === 'ADVANCE' && (
                    <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                      <span>Total Booking Value: <strong className="text-white">{formatCurrency(booking.total)}</strong></span>
                      <span>Balance Due at Venue: <strong className="text-yellow-400">{formatCurrency(booking.remainingAmount)}</strong></span>
                    </div>
                  )}
                </div>

                {/* Screenshot if available */}
                {p.screenshotUrl && (
                  <div className="flex items-center justify-between text-xs text-gray-400 bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
                    <span>Payment Screenshot Uploaded:</span>
                    <a
                      href={p.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-gold hover:underline flex items-center gap-1 font-semibold"
                    >
                      View Image <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Verification Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={processing}
                    onClick={() => handleVerify(p.id)}
                    className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm & Book
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    disabled={processing}
                    onClick={() => handleOpenReject(p.id)}
                    className="flex items-center justify-center gap-1.5 font-semibold"
                  >
                    <XCircle className="w-4 h-4" /> Reject Payment
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject UPI Payment">
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Rejecting this payment will cancel the booking and release the reserved slot back to AVAILABLE status.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Reason for Rejection *</label>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={processing}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;