import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { cn } from './Button';

interface StatusBadgeProps {
  status: string;
  type: 'booking' | 'payment' | 'slot';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className }) => {
  const config = {
    booking: {
      PENDING: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Pending' },
      CONFIRMED: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Confirmed' },
      CANCELLED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Cancelled' },
      COMPLETED: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: CheckCircle2, label: 'Completed' },
    },
    payment: {
      PENDING: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Payment Pending' },
      COMPLETED: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Paid' },
      FAILED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertCircle, label: 'Payment Failed' },
      REFUNDED: { color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: CheckCircle2, label: 'Refunded' },
    },
    slot: {
      AVAILABLE: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Available' },
      BOOKED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Booked' },
      BLOCKED: { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', icon: XCircle, label: 'Blocked' },
      HELD: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Held' },
    },
  } as Record<string, Record<string, { color: string; icon: any; label: string }>>;

  const s = config[type]?.[status.toUpperCase()] || { color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: AlertCircle, label: status };
  const Icon = s.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", s.color, className)}>
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
};
