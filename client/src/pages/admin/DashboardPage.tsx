import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { Link } from 'react-router-dom';
import {
  Ticket,
  DollarSign,
  CalendarClock,
  Clock,
  AlertTriangle,
  CalendarDays,
  XCircle,
  TrendingUp,
  Smartphone,
  Building2,
  AlertCircle,
} from 'lucide-react';
import type { DashboardStats } from '@skylite/shared';
import { formatCurrency } from '@skylite/shared';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const stats = await adminApi.getDashboard();
        setData(stats);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      name: "Today's Bookings",
      value: data?.todayBookings ?? 0,
      icon: Ticket,
      color: 'text-blue-400',
      link: '/admin/bookings',
    },
    {
      name: "Today's Revenue",
      value: formatCurrency(data?.todayRevenue ?? 0),
      icon: DollarSign,
      color: 'text-green-400',
      link: '/admin/reports',
    },
    {
      name: 'Online Revenue (UPI)',
      value: formatCurrency(data?.onlineRevenue ?? 0),
      icon: Smartphone,
      color: 'text-cyan-400',
      link: '/admin/reports',
    },
    {
      name: 'Offline Revenue (Desk)',
      value: formatCurrency(data?.offlineRevenue ?? 0),
      icon: Building2,
      color: 'text-purple-400',
      link: '/admin/reports',
    },
    {
      name: 'Outstanding Balance',
      value: formatCurrency(data?.pendingBalance ?? 0),
      icon: AlertCircle,
      color: 'text-yellow-400',
      alert: (data?.pendingBalance || 0) > 0,
      link: '/admin/bookings',
    },
    {
      name: 'Pending Verifications',
      value: data?.pendingPayments ?? 0,
      icon: AlertTriangle,
      color: 'text-yellow-400',
      alert: (data?.pendingPayments || 0) > 0,
      link: '/admin/payments',
    },
    {
      name: 'Upcoming Bookings',
      value: data?.upcomingBookings ?? 0,
      icon: CalendarDays,
      color: 'text-brand-gold',
      link: '/admin/bookings',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(data?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: 'text-brand-gold',
      link: '/admin/reports',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Dashboard Overview</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-brand-dark border border-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-10 w-10 bg-gray-800 rounded-lg mb-4" />
              <div className="h-4 w-24 bg-gray-800 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time status of private screening operations at SkyLite</p>
        </div>
        <Link
          to="/admin/reports"
          className="flex items-center gap-2 px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-lg hover:bg-brand-gold/20 transition-colors text-xs font-semibold border border-brand-gold/20"
        >
          <TrendingUp className="w-4 h-4" />
          Full Analytics
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className={`bg-brand-dark border ${
              stat.alert ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-gray-800'
            } rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-brand-gold/40 transition-all shadow-xl`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-darker flex items-center justify-center border border-gray-800">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {stat.alert && (
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-400">{stat.name}</p>
              <p className="text-2xl md:text-3xl font-heading font-bold text-white mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;