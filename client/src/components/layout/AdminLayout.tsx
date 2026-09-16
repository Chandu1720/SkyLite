import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  CalendarClock,
  Building2,
  PartyPopper,
  PackageOpen,
  PlusSquare,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ScrollText,
  Tag,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { adminApi } from '../../api/admin';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: Ticket },
  { name: 'Calendar', href: '/admin/calendar', icon: CalendarDays },
  { name: 'Slots', href: '/admin/slots', icon: CalendarClock },
  { name: 'Theatres', href: '/admin/theatres', icon: Building2 },
  { name: 'Occasions', href: '/admin/occasions', icon: PartyPopper },
  { name: 'Packages', href: '/admin/packages', icon: PackageOpen },
  { name: 'Add-ons', href: '/admin/addons', icon: PlusSquare },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard, hasBadge: true },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
];

export const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchPendingPayments = async () => {
    try {
      const pending = await adminApi.getPendingPayments();
      setPendingCount(pending.length);
    } catch (_) {}
  };

  useEffect(() => {
    fetchPendingPayments();
    const interval = setInterval(fetchPendingPayments, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-brand-dark border-r border-gray-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="text-xl font-heading font-bold text-brand-gold">SkyLite Admin</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || (item.href === '/admin/dashboard' && location.pathname === '/admin');
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                          isActive
                            ? 'bg-brand-gold/10 text-brand-gold font-semibold'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </div>
                        {item.hasBadge && pendingCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 bg-brand-dark border-r border-gray-800">
        <div className="flex h-16 items-center px-6 border-b border-gray-800">
          <span className="text-xl font-heading font-bold text-brand-gold">SkyLite Admin</span>
        </div>
        <nav className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href === '/admin/dashboard' && location.pathname === '/admin');
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-brand-gold/10 text-brand-gold font-medium border border-brand-gold/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                    {item.hasBadge && pendingCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-md shadow-red-500/30">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-brand-dark/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 lg:px-8 shadow-sm">
          <button type="button" className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <Link
                to="/admin/payments"
                className="hidden sm:flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 rounded-full text-xs font-medium transition-colors"
              >
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>{pendingCount} Pending Verifications</span>
              </Link>
            )}
            <ThemeToggle />
            <span className="text-xs text-gray-300 hidden sm:block">
              Logged in as <strong className="text-brand-gold">{user?.name || user?.email || 'Admin'}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </header>

        {pendingCount > 0 && location.pathname !== '/admin/payments' && (
          <div className="bg-yellow-500/15 border-b border-yellow-500/30 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm text-yellow-200">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span><strong>Action Required:</strong> You have {pendingCount} payment{pendingCount > 1 ? 's' : ''} awaiting UTR verification.</span>
            </div>
            <Link to="/admin/payments" className="font-bold underline text-yellow-400 hover:text-yellow-300 ml-2">
              Review Now →
            </Link>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-brand-darker">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;