import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency } from '@skylite/shared';
import type { ReportData } from '@skylite/shared';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CalendarCheck,
  Package,
  Sparkles,
  Ban,
  Percent,
  CreditCard,
  Building2,
  AlertCircle,
  Smartphone,
  Wallet,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getReports();
        setReports(data);
      } catch (err: any) {
        toast('error', 'Failed to load report analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading || !reports) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Revenue & Analytics</h1>
        <div className="text-center py-16 text-gray-400">Loading business metrics...</div>
      </div>
    );
  }

  const onlineRev = reports.onlineRevenue || 0;
  const offlineRev = reports.offlineRevenue || 0;
  const totalRev = reports.totalRevenue || (onlineRev + offlineRev);
  const onlinePercent = totalRev > 0 ? Math.round((onlineRev / totalRev) * 100) : 0;
  const offlinePercent = totalRev > 0 ? 100 - onlinePercent : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Revenue & Financial Analytics</h1>
        <p className="text-gray-400 text-sm">Monthly and daily booking metrics, online vs offline collections, and pending balance summaries</p>
      </div>

      {/* Primary Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="text-3xl font-heading font-bold text-brand-gold">
            {formatCurrency(totalRev)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">All confirmed collections</span>
        </div>

        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Bookings</span>
            <CalendarCheck className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="text-3xl font-heading font-bold text-white">
            {reports.monthlyBookings}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Completed & upcoming events</span>
        </div>

        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg. Booking Value</span>
            <TrendingUp className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="text-3xl font-heading font-bold text-white">
            {formatCurrency(reports.averageBookingValue)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Average per booking</span>
        </div>

        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-heading font-bold text-yellow-400">
            {formatCurrency(reports.pendingBalance || 0)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Pending collection at venue</span>
        </div>
      </div>

      {/* Online vs Offline Revenue Section */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-gold" /> Payment Channel Breakdown (Online vs Offline)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribution between online UPI transactions and theatre reception collections (Cash / Card / POS)</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Online UPI ({onlinePercent}%)
            </span>
            <span className="text-purple-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Offline / Walk-in ({offlinePercent}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-gray-900 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${onlinePercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${offlinePercent}%` }}
            />
          </div>
        </div>

        {/* Detailed Cards for Online vs Offline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="bg-brand-darker border border-cyan-500/20 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Online Collections</span>
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">
              {formatCurrency(onlineRev)}
            </div>
            <p className="text-[11px] text-gray-400">Via UPI payment gateway & QR codes</p>
          </div>

          <div className="bg-brand-darker border border-purple-500/20 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Offline / Reception Collections</span>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">
              {formatCurrency(offlineRev)}
            </div>
            <p className="text-[11px] text-gray-400">Via Cash, Card/POS & Venue UPI</p>
          </div>

          <div className="bg-brand-darker border border-yellow-500/20 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-yellow-400 font-semibold">
              <span>Add-on Item Sales</span>
              <Package className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">
              {formatCurrency(reports.addonRevenue)}
            </div>
            <p className="text-[11px] text-gray-400">Cakes, decor, gifts & extra hours</p>
          </div>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popular Occasions */}
        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-heading font-bold text-white">Most Popular Occasions</h2>
          </div>

          {reports.popularOccasions.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No bookings recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.popularOccasions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-brand-darker p-3 rounded-xl border border-gray-800">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-xs bg-brand-gold/10 text-brand-gold font-bold px-2.5 py-1 rounded-full">
                    {item.count} Bookings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Packages */}
        <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Package className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-heading font-bold text-white">Top Selected Packages</h2>
          </div>

          {reports.popularPackages.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No package bookings recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.popularPackages.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-brand-darker p-3 rounded-xl border border-gray-800">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-xs bg-brand-gold/10 text-brand-gold font-bold px-2.5 py-1 rounded-full">
                    {item.count} Bookings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;