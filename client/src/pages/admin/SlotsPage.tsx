import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatTime12h, formatDate } from '@skylite/shared';
import type { SlotDTO, TheatreDTO } from '@skylite/shared';
import { Plus, Calendar, Lock, Unlock, CalendarRange, Filter } from 'lucide-react';

export const SlotsPage: React.FC = () => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<SlotDTO[]>([]);
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedTheatre, setSelectedTheatre] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Bulk / Custom Generator modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkTheatreId, setBulkTheatreId] = useState('');
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [openingTime, setOpeningTime] = useState('10:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [slotDuration, setSlotDuration] = useState('120');
  const [bufferMinutes, setBufferMinutes] = useState('30');
  const [priceOverride, setPriceOverride] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const thList = await adminApi.getTheatres();
      setTheatres(thList);

      const params: Record<string, string> = {};
      if (selectedTheatre) params.theatreId = selectedTheatre;
      if (selectedDate) params.date = selectedDate;
      if (selectedStatus) params.status = selectedStatus;

      const slotList = await adminApi.getSlots(params);
      setSlots(slotList);
    } catch (err: any) {
      toast('error', 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTheatre, selectedDate, selectedStatus]);

  const handleBlock = async (slotId: string) => {
    try {
      await adminApi.blockSlot(slotId);
      toast('success', 'Slot blocked successfully');
      fetchData();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to block slot');
    }
  };

  const handleUnblock = async (slotId: string) => {
    try {
      await adminApi.unblockSlot(slotId);
      toast('success', 'Slot unblocked successfully');
      fetchData();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to unblock slot');
    }
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkTheatreId || !bulkStartDate || !bulkEndDate) {
      toast('error', 'Please fill all bulk generator fields');
      return;
    }

    try {
      setBulkSubmitting(true);
      const res = await adminApi.createCustomSlots({
        theatreId: bulkTheatreId,
        startDate: bulkStartDate,
        endDate: bulkEndDate,
        openingTime,
        closingTime,
        slotDurationMinutes: Number(slotDuration) || 120,
        bufferMinutes: Number(bufferMinutes) || 30,
        priceOverride: priceOverride ? Number(priceOverride) : undefined,
      });
      toast('success', res.message || `Generated ${res.slotsCreated} slots successfully!`);
      setBulkModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to generate custom slots');
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Slot Management</h1>
          <p className="text-gray-400 text-sm">View, block/unblock, and generate slot schedules</p>
        </div>
        <Button variant="primary" onClick={() => setBulkModalOpen(true)} className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4" /> Bulk Generate Slots
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-brand-dark border border-gray-800 rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase">
          <Filter className="w-4 h-4 text-brand-gold" /> Filter By:
        </div>

        <select
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(e.target.value)}
          className="bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
        >
          <option value="">All Theatres</option>
          {theatres.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-brand-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="HELD">HELD</option>
          <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
          <option value="BOOKED">BOOKED</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>

        {(selectedTheatre || selectedDate || selectedStatus) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTheatre('');
              setSelectedDate('');
              setSelectedStatus('');
            }}
            className="text-xs"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Slots Table */}
      <div className="bg-brand-dark border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darker border-b border-gray-800 uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Theatre</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    Loading slots...
                  </td>
                </tr>
              ) : slots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No slots found matching your criteria.
                  </td>
                </tr>
              ) : (
                slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{formatDate(slot.date)}</td>
                    <td className="px-6 py-4 font-mono font-bold text-brand-gold">
                      {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{(slot as any).theatre?.name || 'Main Hall'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={slot.status} type="slot" />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {slot.status === 'AVAILABLE' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBlock(slot.id)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <Lock className="w-3.5 h-3.5 mr-1" /> Block
                        </Button>
                      )}
                      {slot.status === 'BLOCKED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnblock(slot.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Unlock className="w-3.5 h-3.5 mr-1" /> Unblock
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

      {/* Bulk / Custom Generator Modal */}
      <Modal isOpen={bulkModalOpen} onClose={() => setBulkModalOpen(false)} title="Generate Custom Time Slots">
        <form onSubmit={handleBulkGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Target Theatre Hall *</label>
            <select
              required
              value={bulkTheatreId}
              onChange={(e) => setBulkTheatreId(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            >
              <option value="">Select Theatre</option>
              {theatres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Cap: {t.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Opening Time (24h)</label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Closing Time (24h)</label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Slot Duration (Minutes)</label>
              <input
                type="number"
                min={30}
                max={360}
                step={15}
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Cleaning/Buffer Interval (Mins)</label>
              <input
                type="number"
                min={0}
                max={120}
                step={5}
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">Price Override / Surcharge (₹, Optional)</label>
              <input
                type="number"
                placeholder="e.g. 200 for peak/weekend rate"
                value={priceOverride}
                onChange={(e) => setPriceOverride(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setBulkModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={bulkSubmitting}>
              Generate Custom Slots
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SlotsPage;