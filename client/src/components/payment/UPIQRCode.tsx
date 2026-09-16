import React from 'react';

interface UPIQRCodeProps {
  qrCodeDataUrl: string;
  amount: number;
}

export const UPIQRCode: React.FC<UPIQRCodeProps> = ({ qrCodeDataUrl, amount }) => {
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl">
      <div className="w-48 h-48 sm:w-64 sm:h-64 mb-4">
        <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
      </div>
      <p className="text-gray-800 font-body text-center font-medium">Scan with any UPI app</p>
      <div className="flex space-x-2 mt-4 opacity-70">
        <span className="text-xs text-gray-600">GPay</span>
        <span className="text-xs text-gray-600">PhonePe</span>
        <span className="text-xs text-gray-600">Paytm</span>
      </div>
    </div>
  );
};