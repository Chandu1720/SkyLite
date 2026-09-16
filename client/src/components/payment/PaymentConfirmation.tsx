import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface PaymentConfirmationProps {
  onSubmit: (utr: string, screenshot?: File) => Promise<void>;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ onSubmit }) => {
  const [utr, setUtr] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || utr.length < 6) {
      setError('Please enter a valid Transaction Reference (UTR) number');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit(utr, file || undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment details');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-darker rounded-xl border border-gray-800 p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-heading text-white mb-6 text-center">Confirm Payment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-body text-gray-400 mb-2">UPI Transaction ID / UTR *</label>
          <input 
            type="text" 
            value={utr}
            onChange={e => setUtr(e.target.value)}
            className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold font-body"
            placeholder="e.g. 312345678901"
            required
          />
          <p className="text-xs text-gray-500 mt-1 font-body">12-digit number found in your UPI app after payment.</p>
        </div>

        <div>
          <label className="block text-sm font-body text-gray-400 mb-2">Payment Screenshot (Optional)</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-brand-dark hover:border-brand-gold transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload size={24} className="text-gray-500 mb-2" />
            <span className="text-sm text-gray-400 font-body text-center">
              {file ? file.name : 'Click or drag to upload screenshot'}
            </span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-body text-center">{error}</p>}

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-heading text-lg transition-colors ${
            isSubmitting ? 'bg-brand-gold/50 text-brand-dark cursor-not-allowed' : 'bg-brand-gold text-brand-dark hover:bg-yellow-500'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};