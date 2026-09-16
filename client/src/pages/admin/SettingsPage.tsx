import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import {
  Building,
  CreditCard,
  MessageSquare,
  Clock,
  Save,
  ShieldCheck,
  Upload,
  Sparkles,
  Tag,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [businessLogoUrl, setBusinessLogoUrl] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('');
  const [openingTime, setOpeningTime] = useState('10:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [taxPercent, setTaxPercent] = useState('18');
  const [currency, setCurrency] = useState('INR');
  const [holdDuration, setHoldDuration] = useState('10');
  const [verificationTimeout, setVerificationTimeout] = useState('120');
  const [allowAdvancePayment, setAllowAdvancePayment] = useState(true);
  const [advancePaymentType, setAdvancePaymentType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [advancePaymentValue, setAdvancePaymentValue] = useState('30');
  const [allowFullPayment, setAllowFullPayment] = useState(true);
  const [allowPayAtVenue, setAllowPayAtVenue] = useState(true);

  // Welcome Promo Popup States
  const [welcomePopupEnabled, setWelcomePopupEnabled] = useState(true);
  const [welcomePopupTitle, setWelcomePopupTitle] = useState('Exclusive Welcome Offer ✨');
  const [welcomePopupSubtitle, setWelcomePopupSubtitle] = useState('Get 20% OFF on your very first private theatre booking experience!');
  const [welcomePopupCouponCode, setWelcomePopupCouponCode] = useState('WELCOME20');
  const [welcomePopupDiscountText, setWelcomePopupDiscountText] = useState('FLAT 20% OFF');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settingsList = await adminApi.getSettings();
        const map: Record<string, string> = {};
        settingsList.forEach((s) => {
          map[s.key] = s.value;
        });

        setBusinessName(map['business_name'] || 'SkyLite Private Theatre');
        setBusinessLogoUrl(map['business_logo_url'] || '');
        setBusinessPhone(map['business_phone'] || '+91 98765 43210');
        setBusinessEmail(map['business_email'] || 'bookings@skylite.com');
        setWhatsappNumber(map['whatsapp_number'] || '919876543210');
        setAddress(map['address'] || '123 Cinema Boulevard, Entertainment Hub');
        setGoogleMapsUrl(map['google_maps_url'] || 'https://maps.google.com');
        setUpiId(map['upi_id'] || 'skylite@upi');
        setUpiPayeeName(map['upi_payee_name'] || 'SkyLite Private Theatre');
        setOpeningTime(map['opening_time'] || '10:00');
        setClosingTime(map['closing_time'] || '22:00');
        setTaxPercent(map['tax_percentage'] || '18');
        setCurrency(map['currency'] || 'INR');
        setHoldDuration(map['booking_hold_duration'] || '10');
        setVerificationTimeout(map['payment_verification_timeout'] || '120');
        setAllowAdvancePayment(map['allow_advance_payment'] !== 'false');
        setAdvancePaymentType((map['advance_payment_type'] as 'PERCENTAGE' | 'FIXED') || 'PERCENTAGE');
        setAdvancePaymentValue(map['advance_payment_value'] || '30');
        setAllowFullPayment(map['allow_full_payment'] !== 'false');
        setAllowPayAtVenue(map['allow_pay_at_venue'] === 'true');
        setWelcomePopupEnabled(map['welcome_popup_enabled'] !== 'false');
        setWelcomePopupTitle(map['welcome_popup_title'] || 'Exclusive Welcome Offer ✨');
        setWelcomePopupSubtitle(map['welcome_popup_subtitle'] || 'Get 20% OFF on your very first private theatre booking experience!');
        setWelcomePopupCouponCode(map['welcome_popup_coupon_code'] || 'WELCOME20');
        setWelcomePopupDiscountText(map['welcome_popup_discount_text'] || 'FLAT 20% OFF');
      } catch (err: any) {
        toast('error', 'Failed to load business settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateSettings([
        { key: 'business_name', value: businessName },
        { key: 'business_logo_url', value: businessLogoUrl },
        { key: 'business_phone', value: businessPhone },
        { key: 'business_email', value: businessEmail },
        { key: 'whatsapp_number', value: whatsappNumber },
        { key: 'address', value: address },
        { key: 'google_maps_url', value: googleMapsUrl },
        { key: 'upi_id', value: upiId },
        { key: 'upi_payee_name', value: upiPayeeName },
        { key: 'opening_time', value: openingTime },
        { key: 'closing_time', value: closingTime },
        { key: 'tax_percentage', value: taxPercent },
        { key: 'currency', value: currency },
        { key: 'booking_hold_duration', value: holdDuration },
        { key: 'payment_verification_timeout', value: verificationTimeout },
        { key: 'allow_advance_payment', value: String(allowAdvancePayment) },
        { key: 'advance_payment_type', value: advancePaymentType },
        { key: 'advance_payment_value', value: advancePaymentValue },
        { key: 'allow_full_payment', value: String(allowFullPayment) },
        { key: 'allow_pay_at_venue', value: String(allowPayAtVenue) },
        { key: 'welcome_popup_enabled', value: String(welcomePopupEnabled) },
        { key: 'welcome_popup_title', value: welcomePopupTitle },
        { key: 'welcome_popup_subtitle', value: welcomePopupSubtitle },
        { key: 'welcome_popup_coupon_code', value: welcomePopupCouponCode },
        { key: 'welcome_popup_discount_text', value: welcomePopupDiscountText },
      ]);
      toast('success', 'Settings saved successfully!');
    } catch (err: any) {
      toast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const uploaded = await adminApi.uploadImage(file);
      setBusinessLogoUrl(uploaded.url);
      toast('success', 'Business logo uploaded successfully!');
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to upload business logo');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Business Settings</h1>
          <p className="text-gray-400 text-sm">Configure UPI credentials, WhatsApp redirects, tax rates, and operating rules</p>
        </div>
        <Button type="submit" variant="primary" loading={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      {/* Business Info */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-gray-800 pb-3">
          <Building className="w-5 h-5 text-brand-gold" />
          <h2 className="text-lg font-heading font-bold text-white">General Business Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Business Name *</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-1">Business Logo</label>
            <div className="flex flex-col gap-4 rounded-lg border border-gray-800 bg-brand-darker p-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-gold/30 bg-brand-dark">
                {businessLogoUrl ? <img src={businessLogoUrl} alt="Business logo preview" className="h-full w-full object-contain p-2" /> : <Building className="h-7 w-7 text-gray-600" />}
              </div>
              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brand-gold/50 px-3.5 py-2 text-sm font-medium text-brand-gold transition hover:bg-brand-gold/10">
                  <Upload className="h-4 w-4" />
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleLogoUpload} disabled={uploadingLogo} className="sr-only" />
                </label>
                <p className="mt-2 text-[11px] text-gray-500">PNG, JPG, or WEBP. The logo appears in the landing page location card.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Contact Email *</label>
            <input
              type="email"
              required
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Google Maps URL</label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-1">Physical Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>
        </div>
      </div>

      {/* UPI Payment Configuration */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-gray-800 pb-3">
          <CreditCard className="w-5 h-5 text-brand-gold" />
          <h2 className="text-lg font-heading font-bold text-white">UPI Payment Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">UPI VPA / ID (Payee) *</label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. skylite@icici"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-gold"
            />
            <span className="text-[11px] text-gray-500 mt-0.5 block">Used to generate dynamic QR codes and deep links</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Registered Payee Name *</label>
            <input
              type="text"
              required
              value={upiPayeeName}
              onChange={(e) => setUpiPayeeName(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">GST / Tax Percentage (%) *</label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Currency Code</label>
            <input
              type="text"
              disabled
              value={currency}
              className="w-full bg-brand-darker/50 border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp & Rules */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-gray-800 pb-3">
          <MessageSquare className="w-5 h-5 text-brand-gold" />
          <h2 className="text-lg font-heading font-bold text-white">Communication & Booking Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp Business Number (with country code) *</label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Booking Slot Hold Duration (Minutes) *</label>
            <input
              type="number"
              min={5}
              max={60}
              required
              value={holdDuration}
              onChange={(e) => setHoldDuration(e.target.value)}
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
            <span className="text-[11px] text-gray-500 mt-0.5 block">Time granted to user to complete UPI payment before slot releases</span>
          </div>
        </div>
      </div>

      {/* Advance Payment & Customer Payment Options Rules */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-gray-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-brand-gold" />
          <div>
            <h2 className="text-lg font-heading font-bold text-white">Payment Options & Advance Booking Rules</h2>
            <p className="text-xs text-gray-400">Decide which payment options are available for customers during booking</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-brand-darker rounded-xl border border-gray-800">
            <div>
              <p className="text-sm font-semibold text-white">Enable Advance Payment Option</p>
              <p className="text-xs text-gray-400">Allow customers to pay a booking advance online and the remainder at the theatre</p>
            </div>
            <input
              type="checkbox"
              checked={allowAdvancePayment}
              onChange={(e) => setAllowAdvancePayment(e.target.checked)}
              className="w-5 h-5 accent-brand-gold cursor-pointer"
            />
          </div>

          {allowAdvancePayment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-brand-darker/60 rounded-xl border border-brand-gold/20">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Advance Amount Calculation Type</label>
                <select
                  value={advancePaymentType}
                  onChange={(e) => setAdvancePaymentType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                  className="w-full bg-brand-dark border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="PERCENTAGE">Percentage of Total (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  {advancePaymentType === 'PERCENTAGE' ? 'Advance Percentage (%)' : 'Fixed Advance Amount (₹)'}
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={advancePaymentValue}
                  onChange={(e) => setAdvancePaymentValue(e.target.value)}
                  className="w-full bg-brand-dark border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  {advancePaymentType === 'PERCENTAGE'
                    ? 'e.g. 30% means ₹900 advance on a ₹3000 booking'
                    : 'e.g. ₹500 flat advance to hold slot'}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-brand-darker rounded-xl border border-gray-800">
            <div>
              <p className="text-sm font-semibold text-white">Enable 100% Full Payment Option</p>
              <p className="text-xs text-gray-400">Allow customers to pay the entire booking amount upfront online</p>
            </div>
            <input
              type="checkbox"
              checked={allowFullPayment}
              onChange={(e) => setAllowFullPayment(e.target.checked)}
              className="w-5 h-5 accent-brand-gold cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-brand-darker rounded-xl border border-gray-800">
            <div>
              <p className="text-sm font-semibold text-white">Accept Offline Balance at Venue (Cash / Card / POS)</p>
              <p className="text-xs text-gray-400">Receptionists can collect remaining balances when customers arrive</p>
            </div>
            <input
              type="checkbox"
              checked={allowPayAtVenue}
              onChange={(e) => setAllowPayAtVenue(e.target.checked)}
              className="w-5 h-5 accent-brand-gold cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* First-Time User Welcome Promo Popup Settings */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-gray-800 pb-3">
          <Sparkles className="w-5 h-5 text-brand-gold" />
          <div>
            <h2 className="text-lg font-heading font-bold text-white">First-Time Visitor Welcome Promo Popup</h2>
            <p className="text-xs text-gray-400">Configure the luxury pop-up shown to first-time visitors offering an exclusive discount code</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-brand-darker rounded-xl border border-gray-800">
            <div>
              <p className="text-sm font-semibold text-white">Enable Welcome Offer Pop-up</p>
              <p className="text-xs text-gray-400">Display automatic promo pop-up for new customers on the homepage</p>
            </div>
            <input
              type="checkbox"
              checked={welcomePopupEnabled}
              onChange={(e) => setWelcomePopupEnabled(e.target.checked)}
              className="w-5 h-5 accent-brand-gold cursor-pointer"
            />
          </div>

          {welcomePopupEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-brand-darker/60 rounded-xl border border-brand-gold/20">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">Pop-up Main Title</label>
                <input
                  type="text"
                  required
                  value={welcomePopupTitle}
                  onChange={(e) => setWelcomePopupTitle(e.target.value)}
                  placeholder="e.g. Exclusive Welcome Offer ✨"
                  className="w-full bg-brand-dark border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">Pop-up Subtitle / Message</label>
                <input
                  type="text"
                  required
                  value={welcomePopupSubtitle}
                  onChange={(e) => setWelcomePopupSubtitle(e.target.value)}
                  placeholder="e.g. Get 20% OFF on your very first private theatre booking experience!"
                  className="w-full bg-brand-dark border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Promo Coupon Code</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={welcomePopupCouponCode}
                    onChange={(e) => setWelcomePopupCouponCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder="e.g. WELCOME20"
                    className="w-full bg-brand-dark border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono font-bold text-brand-gold focus:outline-none focus:border-brand-gold"
                  />
                  <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  Make sure this coupon code exists and is active in the Promo Codes section.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Discount Tag / Badge Text</label>
                <input
                  type="text"
                  required
                  value={welcomePopupDiscountText}
                  onChange={(e) => setWelcomePopupDiscountText(e.target.value)}
                  placeholder="e.g. FLAT 20% OFF or ₹500 OFF"
                  className="w-full bg-brand-dark border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" size="lg" loading={saving} className="px-8">
          Save All Settings
        </Button>
      </div>
    </form>
  );
};

export default SettingsPage;