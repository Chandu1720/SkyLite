import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { occasionApi } from '../../api/occasions';
import { theatreApi } from '../../api/theatres';
import { packageApi } from '../../api/packages';
import { addonApi } from '../../api/addons';
import { slotApi } from '../../api/slots';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency, formatDate, formatTime12h } from '@skylite/shared';
import type { BookingDTO, TheatreDTO, OccasionDTO, PackageDTO, AddonDTO, SlotDTO } from '@skylite/shared';
import { Search, Filter, Eye, XCircle, Plus, Calendar, DollarSign, CreditCard, Banknote, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingsPage: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Collect Balance Modal State
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedBookingForBalance, setSelectedBookingForBalance] = useState<BookingDTO | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceMethod, setBalanceMethod] = useState<'CASH' | 'CARD' | 'OFFLINE_UPI' | 'UPI'>('CASH');
  const [balanceTxRef, setBalanceTxRef] = useState('');
  const [collecting, setCollecting] = useState(false);

  // Walk-in Booking Modal State
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [occasions, setOccasions] = useState<OccasionDTO[]>([]);
  const [packages, setPackages] = useState<PackageDTO[]>([]);
  const [addons, setAddons] = useState<AddonDTO[]>([]);
  const [availableSlots, setAvailableSlots] = useState<SlotDTO[]>([]);
  
  const [walkinTheatre, setWalkinTheatre] = useState('');
  const [walkinOccasion, setWalkinOccasion] = useState('');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinSlot, setWalkinSlot] = useState('');
  const [walkinPackage, setWalkinPackage] = useState('');
  const [walkinAddons, setWalkinAddons] = useState<string[]>([]);
  const [walkinCustomerName, setWalkinCustomerName] = useState('');
  const [walkinCustomerPhone, setWalkinCustomerPhone] = useState('');
  const [walkinCustomerEmail, setWalkinCustomerEmail] = useState('');
  const [walkinGuestCount, setWalkinGuestCount] = useState(2);
  const [walkinPaymentMethod, setWalkinPaymentMethod] = useState<'CASH' | 'CARD' | 'OFFLINE_UPI' | 'UPI'>('CASH');
  const [walkinPaidAmount, setWalkinPaidAmount] = useState('');
  const [walkinTxRef, setWalkinTxRef] = useState('');
  const [creatingWalkin, setCreatingWalkin] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.bookingStatus = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const data = await adminApi.getBookings(params);
      setBookings(data.bookings);
      setTotal(data.total);
    } catch (err: any) {
      toast('error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter, dateFilter]);

  // Load dropdowns for walk-in booking
  useEffect(() => {
    if (walkinModalOpen) {
      theatreApi.getAll().then((t) => {
        setTheatres(t);
        if (t.length > 0 && !walkinTheatre) setWalkinTheatre(t[0].id);
      }).catch(() => {});
      occasionApi.getAll().then((o) => {
        setOccasions(o);
        if (o.length > 0 && !walkinOccasion) setWalkinOccasion(o[0].id);
      }).catch(() => {});
    }
  }, [walkinModalOpen]);

  useEffect(() => {
    if (walkinOccasion) {
      packageApi.getByOccasion(walkinOccasion).then((pkgs) => {
        setPackages(pkgs);
        if (pkgs.length > 0) {
          setWalkinPackage(pkgs[0].id);
          setWalkinPaidAmount(String(pkgs[0].price));
        }
      }).catch(() => {});
      addonApi.getByOccasion(walkinOccasion).then(setAddons).catch(() => {});
    }
  }, [walkinOccasion]);

  useEffect(() => {
    if (walkinTheatre && walkinDate) {
      slotApi.getAvailable(walkinTheatre, walkinDate).then((slots) => {
        const avail = slots.filter((s) => s.status === 'AVAILABLE');
        setAvailableSlots(avail);
        if (avail.length > 0) setWalkinSlot(avail[0].id);
      }).catch(() => {});
    }
  }, [walkinTheatre, walkinDate]);

  const handleOpenCollectBalance = (booking: BookingDTO) => {
    setSelectedBookingForBalance(booking);
    setBalanceAmount(String(booking.remainingAmount || 0));
    setBalanceMethod('CASH');
    setBalanceTxRef('');
    setCollectModalOpen(true);
  };

  const handleConfirmCollectBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForBalance) return;
    try {
      setCollecting(true);
      await adminApi.collectBalance(selectedBookingForBalance.id, {
        amount: Number(balanceAmount),
        paymentMethod: balanceMethod,
        transactionRef: balanceTxRef || undefined,
      });
      toast('success', 'Balance collected successfully!');
      setCollectModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to collect balance');
    } finally {
      setCollecting(false);
    }
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinTheatre || !walkinOccasion || !walkinSlot || !walkinPackage || !walkinCustomerName || !walkinCustomerPhone) {
      toast('error', 'Please fill in all required walk-in booking details');
      return;
    }

    try {
      setCreatingWalkin(true);
      await adminApi.createWalkInBooking({
        theatreId: walkinTheatre,
        occasionId: walkinOccasion,
        slotId: walkinSlot,
        packageId: walkinPackage,
        addonIds: walkinAddons,
        customerName: walkinCustomerName.trim(),
        customerPhone: walkinCustomerPhone.trim(),
        customerEmail: walkinCustomerEmail.trim() || undefined,
        guestCount: walkinGuestCount,
        paymentMethod: walkinPaymentMethod,
        paidAmount: Number(walkinPaidAmount) || 0,
        transactionRef: walkinTxRef || undefined,
      });
      toast('success', 'Offline Walk-in Booking created successfully!');
      setWalkinModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to create walk-in booking');
    } finally {
      setCreatingWalkin(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The slot will be released.')) return;
    try {
      await adminApi.cancelBooking(bookingId);
      toast('success', 'Booking cancelled and slot released.');
      fetchBookings();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Booking Management</h1>
          <p className="text-gray-400 text-sm">Review, filter, and manage private screening reservations ({total} total)</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setWalkinModalOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> New Walk-In Booking
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-brand-dark border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, customer name, phone..."
            className="w-full bg-brand-darker border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-brand-darker border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
        >
          <option value="">All Booking Statuses</option>
          <option value="HELD">HELD</option>
          <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
          <option value="PAYMENT_VERIFICATION">PAYMENT_VERIFICATION</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-brand-darker border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
        />

        {(search || statusFilter || dateFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setDateFilter('');
            }}
            className="text-xs"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-brand-dark border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darker border-b border-gray-800 uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4">Booking ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Theatre & Time</th>
                <th className="px-5 py-4">Package</th>
                <th className="px-5 py-4">Payment Breakdown</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-brand-gold">
                      <Link to={`/admin/bookings/${b.id}`} className="hover:underline block">
                        {b.bookingReference}
                      </Link>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {b.bookingSource === 'OFFLINE_WALKIN' ? (
                          <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            Walk-In
                          </span>
                        ) : (
                          <span className="text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">Online</span>
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4 space-y-0.5">
                      <span className="font-semibold text-white block">{b.customer?.name}</span>
                      <span className="text-gray-400 text-[11px] block">{b.customer?.phone}</span>
                    </td>

                    <td className="px-5 py-4 space-y-0.5">
                      <span className="font-medium text-white block">{b.theatre?.name || 'Main Hall'}</span>
                      <span className="text-gray-400 text-[11px] block">
                        {formatDate(b.date)} ({formatTime12h(b.startTime)})
                      </span>
                    </td>

                    <td className="px-5 py-4 space-y-0.5">
                      <span className="text-gray-300 block">{b.package?.name}</span>
                      <span className="text-gray-500 text-[11px] block">{b.occasion?.name}</span>
                    </td>

                    <td className="px-5 py-4 space-y-1">
                      <span className="font-heading font-bold text-white block">
                        {formatCurrency(b.total)}
                      </span>
                      {b.paymentType === 'ADVANCE' && (
                        <div className="text-[11px]">
                          <span className="text-green-400">Paid: {formatCurrency(b.advanceAmount)}</span>
                          {(b.remainingAmount || 0) > 0 ? (
                            <span className="text-yellow-400 block font-semibold">
                              Due: {formatCurrency(b.remainingAmount)}
                            </span>
                          ) : (
                            <span className="text-gray-400 block">Cleared</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 space-y-1">
                      <StatusBadge status={b.bookingStatus} type="booking" />
                      <div className="pt-0.5">
                        <StatusBadge status={b.paymentStatus} type="payment" />
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right space-x-1.5">
                      {(b.remainingAmount || 0) > 0 && b.bookingStatus !== 'CANCELLED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenCollectBalance(b)}
                          className="text-xs bg-brand-gold text-brand-dark hover:bg-yellow-400"
                        >
                          <Banknote className="w-3.5 h-3.5 mr-1" /> Collect Balance
                        </Button>
                      )}

                      <Link to={`/admin/bookings/${b.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </Link>

                      {b.bookingStatus !== 'CANCELLED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(b.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Balance Modal */}
      <Modal isOpen={collectModalOpen} onClose={() => setCollectModalOpen(false)} title="Collect Remaining Balance">
        {selectedBookingForBalance && (
          <form onSubmit={handleConfirmCollectBalance} className="space-y-4">
            <div className="bg-brand-darker p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Booking Reference:</span>
                <span className="font-mono font-bold text-brand-gold">{selectedBookingForBalance.bookingReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Customer:</span>
                <span className="text-white">{selectedBookingForBalance.customer?.name} ({selectedBookingForBalance.customer?.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Booking Value:</span>
                <span className="text-white">{formatCurrency(selectedBookingForBalance.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Advance Paid Online:</span>
                <span className="text-green-400">{formatCurrency(selectedBookingForBalance.advanceAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-800">
                <span className="text-white font-semibold">Remaining Balance Due:</span>
                <span className="text-yellow-400 font-bold text-sm">{formatCurrency(selectedBookingForBalance.remainingAmount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Amount to Collect (₹) *</label>
              <input
                type="number"
                min={1}
                max={selectedBookingForBalance.remainingAmount}
                required
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Payment Method *</label>
              <select
                value={balanceMethod}
                onChange={(e) => setBalanceMethod(e.target.value as any)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              >
                <option value="CASH">Cash at Reception</option>
                <option value="CARD">Credit / Debit Card POS</option>
                <option value="OFFLINE_UPI">Offline UPI (Counter QR)</option>
                <option value="UPI">Online Payment Link</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Transaction Ref / Notes (Optional)</label>
              <input
                type="text"
                value={balanceTxRef}
                onChange={(e) => setBalanceTxRef(e.target.value)}
                placeholder="e.g. POS Receipt # or UPI Ref"
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <Button variant="ghost" type="button" onClick={() => setCollectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={collecting}>
                Record Payment & Clear Balance
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Offline Walk-in Booking Modal */}
      <Modal isOpen={walkinModalOpen} onClose={() => setWalkinModalOpen(false)} title="Create Offline / Walk-in Booking">
        <form onSubmit={handleCreateWalkIn} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Theatre Hall *</label>
              <select
                value={walkinTheatre}
                onChange={(e) => setWalkinTheatre(e.target.value)}
                required
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                {theatres.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} (Cap: {t.capacity})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Occasion *</label>
              <select
                value={walkinOccasion}
                onChange={(e) => setWalkinOccasion(e.target.value)}
                required
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                {occasions.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={walkinDate}
                onChange={(e) => setWalkinDate(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Time Slot *</label>
              <select
                value={walkinSlot}
                onChange={(e) => setWalkinSlot(e.target.value)}
                required
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                {availableSlots.length === 0 ? (
                  <option value="">No available slots on this date</option>
                ) : (
                  availableSlots.map((s) => (
                    <option key={s.id} value={s.id}>{formatTime12h(s.startTime)} - {formatTime12h(s.endTime)}</option>
                  ))
                )}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">Package *</label>
              <select
                value={walkinPackage}
                onChange={(e) => {
                  setWalkinPackage(e.target.value);
                  const p = packages.find((pkg) => pkg.id === e.target.value);
                  if (p) setWalkinPaidAmount(String(p.price));
                }}
                required
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} — {formatCurrency(pkg.price)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">Customer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={walkinCustomerName}
                  onChange={(e) => setWalkinCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={walkinCustomerPhone}
                  onChange={(e) => setWalkinCustomerPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={walkinCustomerEmail}
                  onChange={(e) => setWalkinCustomerEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Guest Count</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={walkinGuestCount}
                  onChange={(e) => setWalkinGuestCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Method *</label>
                <select
                  value={walkinPaymentMethod}
                  onChange={(e) => setWalkinPaymentMethod(e.target.value as any)}
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="CASH">Cash Payment</option>
                  <option value="CARD">Card POS</option>
                  <option value="OFFLINE_UPI">Offline UPI (Counter QR)</option>
                  <option value="UPI">Direct UPI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Amount Paid Now (₹) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={walkinPaidAmount}
                  onChange={(e) => setWalkinPaidAmount(e.target.value)}
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">Transaction Ref (Optional)</label>
                <input
                  type="text"
                  value={walkinTxRef}
                  onChange={(e) => setWalkinTxRef(e.target.value)}
                  placeholder="Receipt number or UPI UTR"
                  className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setWalkinModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={creatingWalkin}>
              Create & Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingsPage;