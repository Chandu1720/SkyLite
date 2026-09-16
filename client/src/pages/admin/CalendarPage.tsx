import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatTime12h, formatDate } from '@skylite/shared';
import type { SlotDTO, TheatreDTO } from '@skylite/shared';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  Unlock,
  Building2,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<SlotDTO[]>([]);
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const dateStr = currentDate.toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [thList, slotList] = await Promise.all([
        adminApi.getTheatres(),
        adminApi.getCalendar({ date: dateStr }),
      ]);
      setTheatres(thList);
      setSlots(slotList);
    } catch (err: any) {
      toast('error', 'Failed to load calendar schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateStr]);

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBlock = async (slotId: string) => {
    try {
      await adminApi.blockSlot(slotId);
      toast('success', 'Slot blocked');
      fetchData();
    } catch (err: any) {
      toast('error', 'Failed to block slot');
    }
  };

  const handleUnblock = async (slotId: string) => {
    try {
      await adminApi.unblockSlot(slotId);
      toast('success', 'Slot unblocked');
      fetchData();
    } catch (err: any) {
      toast('error', 'Failed to unblock slot');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Daily Operations Calendar</h1>
          <p className="text-gray-400 text-sm">Visual schedule across screening rooms for {formatDate(dateStr)}</p>
        </div>

        <div className="flex items-center gap-2 bg-brand-dark border border-gray-800 p-1 rounded-xl">
          <Button variant="ghost" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold text-brand-gold hover:text-white transition-colors flex items-center gap-1.5"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Today
          </button>
          <span className="text-xs font-medium text-white px-2">{formatDate(dateStr)}</span>
          <Button variant="ghost" size="sm" onClick={handleNextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Theatres Schedule */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading daily schedule...</div>
      ) : theatres.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No theatres registered.</div>
      ) : (
        <div className="space-y-6">
          {theatres.map((theatre) => {
            const theatreSlots = slots.filter((s) => s.theatreId === theatre.id);

            return (
              <div key={theatre.id} className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-brand-gold" />
                    <h2 className="text-lg font-heading font-bold text-white">{theatre.name}</h2>
                  </div>
                  <span className="text-xs text-gray-400">
                    Capacity: {theatre.capacity} Guests • {theatreSlots.length} Slots
                  </span>
                </div>

                {theatreSlots.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">
                    No slots scheduled for this theatre on this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {theatreSlots.map((slot) => {
                      const isAvailable = slot.status === 'AVAILABLE';
                      const isBlocked = slot.status === 'BLOCKED';

                      return (
                        <div
                          key={slot.id}
                          className="bg-brand-darker border border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-brand-gold font-mono font-bold mb-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                            </div>
                            <div className="mt-2">
                              <StatusBadge status={slot.status} type="slot" />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-800 flex justify-end">
                            {isAvailable && (
                              <button
                                onClick={() => handleBlock(slot.id)}
                                className="text-[11px] text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                              >
                                <Lock className="w-3 h-3" /> Block
                              </button>
                            )}
                            {isBlocked && (
                              <button
                                onClick={() => handleUnblock(slot.id)}
                                className="text-[11px] text-green-400 hover:text-green-300 flex items-center gap-1"
                              >
                                <Unlock className="w-3 h-3" /> Unblock
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;