import React from 'react';
import { CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentStatusProps {
  status: 'UNDER_VERIFICATION' | 'PAID' | 'REJECTED';
  bookingRef: string;
  amount: number;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, bookingRef, amount }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PAID':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Verified!',
          message: 'Your booking is confirmed.',
          color: 'text-green-500'
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Rejected',
          message: 'We could not verify your payment. Please contact support.',
          color: 'text-red-500'
        };
      case 'UNDER_VERIFICATION':
      default:
        return {
          icon: <Clock className="w-16 h-16 text-brand-gold" />,
          title: 'Verifying Payment',
          message: 'Your payment details have been submitted. Waiting for verification by our team. This usually takes 5-10 minutes.',
          color: 'text-brand-gold'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="bg-brand-darker rounded-xl border border-gray-800 p-8 max-w-md mx-auto text-center flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6"
      >
        {config.icon}
      </motion.div>
      
      <h2 className={`text-2xl font-heading mb-2 ${config.color}`}>{config.title}</h2>
      <p className="text-gray-400 font-body mb-8">{config.message}</p>

      <div className="w-full bg-brand-dark p-4 rounded-lg border border-gray-800 mb-8 flex justify-between">
        <div className="text-left">
          <p className="text-xs text-gray-500 font-body">Booking Ref</p>
          <p className="text-white font-heading">{bookingRef}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-body">Amount</p>
          <p className="text-white font-heading">₹{amount.toFixed(2)}</p>
        </div>
      </div>

      <a 
        href={`https://wa.me/919876543210?text=Hi, regarding my booking ${bookingRef} (Status: ${status})`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 bg-[#25D366] text-white rounded-lg font-body font-medium flex items-center justify-center hover:bg-[#128C7E] transition-colors"
      >
        <MessageCircle size={20} className="mr-2" />
        Contact Support via WhatsApp
      </a>
    </div>
  );
};