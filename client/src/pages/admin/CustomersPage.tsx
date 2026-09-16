import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatDate } from '@skylite/shared';
import type { CustomerDTO } from '@skylite/shared';
import { Users, Search, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCustomers({ search });
      setCustomers(data.customers);
      setTotal(data.total);
    } catch (err: any) {
      toast('error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Customer Database</h1>
          <p className="text-gray-400 text-sm">Overview of registered celebration guests and booking history ({total} total)</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full bg-brand-dark border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-brand-dark border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darker border-b border-gray-800 uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Total Bookings</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Booking Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-heading font-bold text-xs">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      {customer.name}
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Phone className="w-3 h-3 text-brand-gold" /> {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Mail className="w-3 h-3 text-gray-500" /> {customer.email}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-800 px-2 py-0.5 rounded-full text-gray-300 font-semibold">
                        {customer.totalBookings || 0} Bookings
                      </span>
                    </td>

                    <td className="px-6 py-4 font-heading font-bold text-brand-gold">
                      {formatCurrency(customer.totalSpent || 0)}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {customer.lastBookingDate ? formatDate(customer.lastBookingDate) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;