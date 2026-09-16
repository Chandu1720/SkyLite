import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '@skylite/shared';
import type { CouponDTO, CreateCouponInput } from '@skylite/shared';
import { 
  Plus, Edit2, Trash2, Tag, Percent, IndianRupee, 
  Calendar, CheckCircle2, XCircle, AlertCircle, Copy, Check
} from 'lucide-react';

export const CouponsPage: React.FC = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<CouponDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDTO | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCoupons();
      setCoupons(data);
    } catch (err: any) {
      toast('error', 'Failed to load coupon codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    toast('success', `Copied ${couponCode} to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(10);
    setMinOrderAmount(0);
    setMaxDiscountAmount(undefined);
    setStartDate('');
    setEndDate('');
    setUsageLimit(undefined);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon: CouponDTO) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinOrderAmount(coupon.minOrderAmount);
    setMaxDiscountAmount(coupon.maxDiscountAmount || undefined);
    setStartDate(coupon.startDate ? coupon.startDate.split('T')[0] : '');
    setEndDate(coupon.endDate ? coupon.endDate.split('T')[0] : '');
    setUsageLimit(coupon.usageLimit || undefined);
    setIsActive(coupon.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast('error', 'Coupon code is required');
      return;
    }
    if (discountValue <= 0) {
      toast('error', 'Discount value must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      const payload: CreateCouponInput = {
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        isActive,
      };

      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.id, payload);
        toast('success', 'Coupon updated successfully');
      } else {
        await adminApi.createCoupon(payload);
        toast('success', 'Coupon created successfully');
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) {
      return;
    }
    try {
      await adminApi.deleteCoupon(id);
      toast('success', 'Coupon deleted successfully');
      fetchCoupons();
    } catch (err: any) {
      toast('error', 'Failed to delete coupon');
    }
  };

  const handleToggleActive = async (coupon: CouponDTO) => {
    try {
      await adminApi.updateCoupon(coupon.id, { isActive: !coupon.isActive });
      toast('success', `Coupon ${coupon.code} ${!coupon.isActive ? 'activated' : 'deactivated'}`);
      fetchCoupons();
    } catch (err: any) {
      toast('error', 'Failed to update coupon status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-brand-gold" />
            Promo Codes & Discounts
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage dynamic discount coupons for customer bookings and promotions
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Coupon
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-dark/60 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Active Coupons</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {coupons.filter(c => c.isActive).length} <span className="text-xs text-gray-500 font-normal">/ {coupons.length} total</span>
            </p>
          </div>
        </div>

        <div className="bg-brand-dark/60 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Redemptions</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {coupons.reduce((sum, c) => sum + c.usageCount, 0)} uses
            </p>
          </div>
        </div>

        <div className="bg-brand-dark/60 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Discount Types</p>
            <p className="text-sm font-semibold text-white mt-1">
              {coupons.filter(c => c.discountType === 'PERCENTAGE').length} Percentage &bull; {coupons.filter(c => c.discountType === 'FIXED').length} Flat ₹
            </p>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-brand-dark/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mb-3"></div>
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <Tag className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-lg font-medium text-white mb-1">No Coupons Created Yet</p>
            <p className="text-sm text-gray-400 mb-4">Add your first promotional discount coupon code for your customers.</p>
            <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Coupon
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-brand-dark/80 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-6">Discount Value</th>
                  <th className="py-4 px-6">Conditions</th>
                  <th className="py-4 px-6">Redemptions</th>
                  <th className="py-4 px-6">Validity</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {coupons.map((coupon) => {
                  const isExpired = coupon.endDate && new Date(coupon.endDate) < new Date();
                  const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

                  return (
                    <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded border border-brand-gold/20">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            title="Copy code"
                            className="text-gray-400 hover:text-white transition-colors p-1"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{coupon.description}</p>
                        )}
                      </td>

                      {/* Value */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-white text-base">
                          {coupon.discountType === 'PERCENTAGE' ? (
                            <>
                              <Percent className="w-4 h-4 text-brand-gold" />
                              <span>{coupon.discountValue}% OFF</span>
                            </>
                          ) : (
                            <>
                              <span>{formatCurrency(coupon.discountValue)} OFF</span>
                            </>
                          )}
                        </div>
                        {coupon.discountType === 'PERCENTAGE' && coupon.maxDiscountAmount ? (
                          <span className="text-xs text-gray-400 block mt-0.5">
                            Capped up to {formatCurrency(coupon.maxDiscountAmount)}
                          </span>
                        ) : null}
                      </td>

                      {/* Conditions */}
                      <td className="py-4 px-6">
                        <div className="text-xs text-gray-300 space-y-0.5">
                          {coupon.minOrderAmount > 0 ? (
                            <div>Min Subtotal: <span className="font-medium text-white">{formatCurrency(coupon.minOrderAmount)}</span></div>
                          ) : (
                            <div className="text-gray-500">No min order required</div>
                          )}
                        </div>
                      </td>

                      {/* Redemptions */}
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-200 font-medium">
                          {coupon.usageCount} <span className="text-gray-500">/ {coupon.usageLimit ?? '∞'}</span>
                        </div>
                        {isLimitReached && (
                          <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3" /> Limit Reached
                          </span>
                        )}
                      </td>

                      {/* Validity */}
                      <td className="py-4 px-6">
                        <div className="text-xs text-gray-300">
                          {coupon.startDate || coupon.endDate ? (
                            <div>
                              {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'Start'}
                              {' → '}
                              {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'Forever'}
                            </div>
                          ) : (
                            <span className="text-gray-500">Always valid</span>
                          )}
                          {isExpired && (
                            <span className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                              <AlertCircle className="w-3 h-3" /> Expired
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            coupon.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          {coupon.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleOpenEdit(coupon)}
                            className="!p-2 text-gray-300 hover:text-white"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="!p-2 text-rose-400 hover:text-rose-300"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promo Code'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Code */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Coupon Code <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
              placeholder="e.g. WELCOME20, FESTIVE500"
              className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white font-mono font-bold tracking-wider placeholder-gray-500 focus:outline-none focus:border-brand-gold"
            />
            <p className="text-[11px] text-gray-400 mt-1">Codes are automatically capitalized with no spaces.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Description / Internal Note
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 20% off for first-time visitors popup"
              className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
              >
                <option value="PERCENTAGE">Percentage (%) Off</option>
                <option value="FIXED">Flat Rupee (₹) Off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Discount Value <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={discountType === 'PERCENTAGE' ? 100 : 50000}
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm pl-8"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 font-bold">
                  {discountType === 'PERCENTAGE' ? '%' : '₹'}
                </span>
              </div>
            </div>
          </div>

          {/* Min Order & Max Discount (for %) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                placeholder="0 (No minimum)"
                className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>

            {discountType === 'PERCENTAGE' ? (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Max Discount Cap (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxDiscountAmount ?? ''}
                  onChange={(e) => setMaxDiscountAmount(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 500 (Optional)"
                  className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit ?? ''}
                  onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 100 (Unlimited if blank)"
                  className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>
            )}
          </div>

          {/* If Percentage, show Usage Limit on another row */}
          {discountType === 'PERCENTAGE' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Total Usage Limit
              </label>
              <input
                type="number"
                min="1"
                value={usageLimit ?? ''}
                onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 50 (Unlimited if blank)"
                className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
          )}

          {/* Validity Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Valid From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Valid Until / Expiry
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-brand-dark border border-white/15 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActiveCoupon"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-brand-gold focus:ring-brand-gold/40 bg-brand-dark"
            />
            <label htmlFor="isActiveCoupon" className="text-sm font-medium text-gray-300 cursor-pointer">
              Coupon is Active and can be redeemed
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
