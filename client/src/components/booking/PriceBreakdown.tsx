import React from 'react';
import { formatCurrency } from '@skylite/shared';

export interface PriceItem {
  label: string;
  amount: number;
}

export interface PriceBreakdownProps {
  items?: PriceItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  packagePrice?: number;
  addons?: { name: string; price: number }[];
  taxPercent?: number;
  paymentType?: 'FULL' | 'ADVANCE';
  advanceAmount?: number;
  remainingAmount?: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  items,
  subtotal,
  tax,
  discount = 0,
  total,
  packagePrice,
  addons = [],
  taxPercent = 18,
  paymentType,
  advanceAmount,
  remainingAmount,
}) => {
  const pkgPrice = packagePrice ?? 0;
  const addonsTotal = (addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
  const computedSubtotal = subtotal !== undefined ? subtotal : (pkgPrice + addonsTotal);
  const taxRate = (taxPercent ?? 18) / 100;
  const computedTax = tax !== undefined ? tax : Math.round(computedSubtotal * taxRate * 100) / 100;
  const computedTotal = total !== undefined ? total : Math.max(0, computedSubtotal + computedTax - (discount || 0));

  const displayItems: PriceItem[] = items && items.length > 0
    ? items
    : [
        ...(pkgPrice > 0 ? [{ label: 'Experience Package', amount: pkgPrice }] : []),
        ...(addons || []).map((a) => ({ label: a.name, amount: a.price })),
      ];

  const isAdvance = paymentType === 'ADVANCE' && (advanceAmount !== undefined ? advanceAmount < computedTotal : true);
  const finalAdvance = advanceAmount !== undefined ? advanceAmount : Math.round(computedTotal * 0.3);
  const finalRemaining = remainingAmount !== undefined ? remainingAmount : Math.max(0, computedTotal - finalAdvance);

  return (
    <div className="bg-brand-darker p-5 rounded-xl border border-gray-800 font-body space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
        <h3 className="text-base font-heading font-semibold text-white">Price Breakdown</h3>
        <span className="text-[11px] text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded font-medium">
          {taxPercent}% GST Included
        </span>
      </div>

      <div className="space-y-2">
        {displayItems.length > 0 ? (
          displayItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-gray-300 text-xs sm:text-sm">
              <span className="text-gray-400">{item.label}</span>
              <span className="font-medium text-white">{formatCurrency(item.amount)}</span>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 italic py-1">Select a package to view breakdown</div>
        )}
      </div>

      <div className="border-t border-gray-800/80 pt-3 space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span className="text-gray-200 font-medium">{formatCurrency(computedSubtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Taxes ({taxPercent}% GST)</span>
          <span className="text-gray-200 font-medium">{formatCurrency(computedTax)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-brand-gold/30 pt-3 flex justify-between items-center">
        <span className="text-white font-heading text-base font-semibold">Total Amount</span>
        <span className="text-white font-heading text-xl font-bold">
          {formatCurrency(computedTotal)}
        </span>
      </div>

      {isAdvance && (
        <div className="mt-3 pt-3 border-t border-gray-800/80 bg-brand-dark/50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-brand-gold text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
              Payable Advance Online
            </span>
            <span className="text-brand-gold font-bold text-lg">
              {formatCurrency(finalAdvance)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Remaining Due at Venue:</span>
            <span className="font-semibold text-gray-200">{formatCurrency(finalRemaining)}</span>
          </div>
        </div>
      )}
    </div>
  );
};