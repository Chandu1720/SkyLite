import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  'Occasion',
  'Theatre',
  'Date',
  'Slot',
  'Package',
  'Add-ons',
  'Details',
  'Payment',
];

interface BookingStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep, onStepClick }) => {
  // Normalize 1-indexed currentStep (1 to 8) to 0-indexed stepIndex (0 to 7)
  const stepIndex = Math.max(0, Math.min(steps.length - 1, currentStep - 1));
  const progressPercent = (stepIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-5 mb-4">
      {/* Mobile View */}
      <div className="md:hidden flex flex-col items-center bg-brand-dark p-4 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-brand-gold font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Step {stepIndex + 1} of {steps.length}
          </span>
          <span className="text-xs text-gray-400 font-semibold">{Math.round(((stepIndex + 1) / steps.length) * 100)}% Completed</span>
        </div>
        <h2 className="text-white font-heading text-lg font-bold mb-3 self-start">{steps[stepIndex] || 'Booking Step'}</h2>
        <div className="w-full bg-brand-darker rounded-full h-2.5 overflow-hidden border border-gray-800 p-0.5">
          <motion.div
            className="bg-gradient-to-r from-brand-accent via-brand-gold to-[#F7E7B4] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between w-full relative px-2">
        {/* Background track */}
        <div className="absolute left-6 right-6 top-1/2 transform -translate-y-1/2 h-1 bg-gray-800/90 rounded-full z-0" />
        
        {/* Active progress fill */}
        <motion.div 
          className="absolute left-6 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-brand-accent to-brand-gold rounded-full z-0 shadow-[0_0_12px_rgba(212,175,55,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPercent}% * 0.92)` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {steps.map((step, index) => {
          const isActive = index === stepIndex;
          const isCompleted = index < stepIndex;
          const stepNumber = index + 1;
          const isClickable = onStepClick && isCompleted;

          return (
            <div
              key={step}
              onClick={() => isClickable && onStepClick(stepNumber)}
              className={`relative z-10 flex flex-col items-center group ${isClickable ? 'cursor-pointer' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs ${
                  isActive
                    ? 'border-brand-gold bg-brand-gold text-brand-dark shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-110'
                    : isCompleted
                    ? 'border-brand-gold/80 bg-brand-gold/20 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark'
                    : 'border-gray-700 bg-brand-dark text-gray-500'
                }`}
              >
                {isCompleted ? <Check size={16} className="stroke-[3]" /> : <span>{stepNumber}</span>}
              </div>
              <span
                className={`absolute top-11 whitespace-nowrap font-body text-xs transition-colors ${
                  isActive
                    ? 'text-brand-gold font-bold scale-105'
                    : isCompleted
                    ? 'text-gray-300 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};