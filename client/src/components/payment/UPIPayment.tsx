import React from 'react';
import { UPIQRCode } from './UPIQRCode';
import { HoldTimer } from '../booking/HoldTimer';

interface UPIPaymentProps {
  bookingRef: string;
  amount: number;
  qrCodeUrl: string;
  upiId: string;
  upiLink: string;
  expiresAt: string;
  onPaymentComplete: () => void;
  onExpire: () => void;
}

export const UPIPayment: React.FC<UPIPaymentProps> = ({ 
  bookingRef, amount, qrCodeUrl, upiId, upiLink, expiresAt, onPaymentComplete, onExpire 
}) => {
  return (
    <div className="bg-brand-darker rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <p className="text-gray-400 font-body text-sm">Booking Reference</p>
          <p className="text-white font-heading text-lg">{bookingRef}</p>
        </div>
        <HoldTimer expiresAt={expiresAt} onExpire={onExpire} />
      </div>
      
      <div className="p-8 flex flex-col items-center">
        <p className="text-gray-400 font-body mb-2">Amount to Pay</p>
        <p className="text-4xl font-heading text-brand-gold mb-8">₹{amount.toFixed(2)}</p>

        <a 
          href={upiLink}
          className="w-full md:w-auto px-8 py-4 bg-brand-gold text-brand-dark rounded-lg font-heading text-xl text-center hover:bg-yellow-500 transition-colors mb-8 md:hidden block"
        >
          Pay with UPI App
        </a>

        <div className="w-full flex items-center justify-center mb-8 md:hidden">
          <div className="h-px bg-gray-800 flex-grow"></div>
          <span className="px-4 text-gray-500 font-body text-sm">OR</span>
          <div className="h-px bg-gray-800 flex-grow"></div>
        </div>

        <UPIQRCode qrCodeDataUrl={qrCodeUrl} amount={amount} />
        
        <p className="mt-4 text-sm font-body text-gray-400">UPI ID: {upiId}</p>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800 text-sm font-body text-gray-400 text-center max-w-md">
          <p>After completing the payment on your UPI app, click the button below to provide the transaction reference number.</p>
        </div>

        <button 
          onClick={onPaymentComplete}
          className="mt-8 w-full max-w-md py-4 border-2 border-brand-gold text-brand-gold rounded-lg font-heading text-lg hover:bg-brand-gold hover:text-brand-dark transition-colors"
        >
          I Have Completed Payment
        </button>
      </div>
    </div>
  );
};