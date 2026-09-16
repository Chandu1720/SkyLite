import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface CustomerDetails {
  fullName: string;
  mobile: string;
  email: string;
  guestCount: number;
  specialRequest?: string;
}

interface CustomerFormProps {
  initialData?: CustomerDetails;
  onSubmit: (data: CustomerDetails) => void;
  maxGuests?: number;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ initialData, onSubmit, maxGuests = 20 }) => {
  const [formData, setFormData] = useState<CustomerDetails>(initialData || {
    fullName: '',
    mobile: '',
    email: '',
    guestCount: 2,
    specialRequest: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Valid 10-digit mobile number required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Valid email required';
    if (formData.guestCount < 1 || formData.guestCount > maxGuests) newErrors.guestCount = `Must be between 1 and ${maxGuests}`;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form id="customer-form" onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-body text-gray-400 mb-2">Full Name</label>
        <input 
          type="text" 
          value={formData.fullName}
          onChange={e => setFormData({...formData, fullName: e.target.value})}
          className="w-full bg-brand-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold font-body"
          placeholder="John Doe"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1 font-body">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-body text-gray-400 mb-2">Mobile Number</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 text-gray-400 text-sm font-body">
              +91
            </span>
            <input 
              type="tel" 
              maxLength={10}
              value={formData.mobile}
              onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
              className="w-full bg-brand-darker border border-gray-700 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold font-body"
              placeholder="9876543210"
            />
          </div>
          {errors.mobile && <p className="text-red-500 text-xs mt-1 font-body">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block text-sm font-body text-gray-400 mb-2">Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full bg-brand-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold font-body"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-body text-gray-400 mb-2">Number of Guests</label>
        <div className="flex items-center space-x-4">
          <button 
            type="button"
            onClick={() => setFormData({...formData, guestCount: Math.max(1, formData.guestCount - 1)})}
            className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
          >-</button>
          <div className="w-16 h-12 flex items-center justify-center bg-brand-darker border border-gray-700 rounded-lg text-xl font-heading text-white">
            {formData.guestCount}
          </div>
          <button 
            type="button"
            onClick={() => setFormData({...formData, guestCount: Math.min(maxGuests, formData.guestCount + 1)})}
            className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
          >+</button>
          <span className="text-gray-400 text-sm font-body ml-4 flex items-center">
            <Users size={16} className="mr-2" />
            Max {maxGuests}
          </span>
        </div>
        {errors.guestCount && <p className="text-red-500 text-xs mt-1 font-body">{errors.guestCount}</p>}
      </div>

      <div>
        <label className="block text-sm font-body text-gray-400 mb-2">Special Requests (Optional)</label>
        <textarea 
          value={formData.specialRequest}
          onChange={e => setFormData({...formData, specialRequest: e.target.value})}
          rows={3}
          className="w-full bg-brand-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold font-body resize-none"
          placeholder="Any special decorations, cake flavors, or allergies..."
        />
      </div>
    </form>
  );
};