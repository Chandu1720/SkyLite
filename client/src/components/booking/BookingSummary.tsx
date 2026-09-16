import React from 'react';
import { motion } from 'framer-motion';
import { PriceBreakdown } from './PriceBreakdown';
import { Calendar, Clock, MapPin, Users, Info } from 'lucide-react';
import { formatDate } from '@skylite/shared';

interface BookingSummaryProps {
  bookingData: any;
  onEditStep: (step: number) => void;
  onProceed: () => void;
  isSubmitting?: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingData = {}, onEditStep, onProceed, isSubmitting }) => {
  const { occasion, theatre, date, slot, pkg, addOns = [], customerDetails, totalAmount, priceBreakdown } = bookingData || {};

  return (
    <div className="bg-brand-dark rounded-xl border border-gray-800 p-6">
      <h2 className="text-2xl font-heading text-white mb-6">Booking Summary</h2>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-start">
          <MapPin className="text-brand-gold mt-1 mr-4 shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-lg text-white">{theatre?.name}</h4>
              <button onClick={() => onEditStep(1)} className="text-xs text-brand-gold font-body hover:underline">Edit</button>
            </div>
            <p className="text-sm font-body text-gray-400">{occasion?.name}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Calendar className="text-brand-gold mt-1 mr-4 shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-lg text-white">
                {date ? formatDate(date) : 'Select Date'}
              </h4>
              <button onClick={() => onEditStep(2)} className="text-xs text-brand-gold font-body hover:underline">Edit</button>
            </div>
            <div className="text-sm font-body text-gray-400 flex items-center mt-1">
              <Clock size={14} className="mr-1" />
              {slot?.startTime} - {slot?.endTime}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <Info className="text-brand-gold mt-1 mr-4 shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-lg text-white">{pkg?.name}</h4>
              <button onClick={() => onEditStep(4)} className="text-xs text-brand-gold font-body hover:underline">Edit</button>
            </div>
            {Array.isArray(addOns) && addOns.length > 0 && (
              <div className="mt-2 text-sm font-body text-gray-400">
                <span className="font-semibold text-gray-300">Add-ons:</span> {(addOns || []).map((a: any) => a?.name || '').filter(Boolean).join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <Users className="text-brand-gold mt-1 mr-4 shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-lg text-white">Guest Details</h4>
              <button onClick={() => onEditStep(6)} className="text-xs text-brand-gold font-body hover:underline">Edit</button>
            </div>
            <div className="mt-1 text-sm font-body text-gray-400">
              <p>{customerDetails?.fullName}</p>
              <p>+91 {customerDetails?.mobile}</p>
              <p>{customerDetails?.guestCount} Guests</p>
              {customerDetails?.specialRequest && (
                <p className="mt-2 italic bg-brand-darker p-2 rounded border border-gray-800">
                  "{customerDetails.specialRequest}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <PriceBreakdown 
          items={priceBreakdown?.items || []}
          subtotal={priceBreakdown?.subtotal || 0}
          tax={priceBreakdown?.tax || 0}
          total={totalAmount || 0}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onProceed}
        disabled={isSubmitting}
        className={`w-full py-4 rounded-lg font-heading text-xl transition-colors ${
          isSubmitting ? 'bg-brand-gold/50 text-brand-dark cursor-not-allowed' : 'bg-brand-gold text-brand-dark hover:bg-yellow-500'
        }`}
      >
        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
      </motion.button>
    </div>
  );
};