import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface PublicSettings {
  businessName: string;
  businessLogoUrl: string;
  businessPhone: string;
  businessEmail: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  googleMapsUrl: string;
  openingTime: string;
  closingTime: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  heroBannerUrl?: string;
  aboutText?: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<any>('/settings/public');
        setSettings(response.data?.data || response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching settings:', err);
        setError(err.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
