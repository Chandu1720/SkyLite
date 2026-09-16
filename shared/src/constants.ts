// ============================================================
// SkyLite Private Theatre — Shared Constants
// ============================================================

export const BOOKING_REF_PREFIX = 'SKL';

export const DEFAULT_HOLD_DURATION_MINUTES = 10;
export const DEFAULT_VERIFICATION_TIMEOUT_MINUTES = 120;
export const DEFAULT_TAX_PERCENT = 18;
export const DEFAULT_SLOT_DURATION_MINUTES = 120;
export const DEFAULT_BUFFER_MINUTES = 30;
export const DEFAULT_ADVANCE_BOOKING_DAYS = 30;
export const DEFAULT_MIN_ADVANCE_HOURS = 4;

export const MAX_GUEST_COUNT = 20;
export const MIN_GUEST_COUNT = 1;

export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

export const SLOT_TIMES = [
  { start: '10:00', end: '12:00' },
  { start: '12:30', end: '14:30' },
  { start: '15:00', end: '17:00' },
  { start: '17:30', end: '19:30' },
  { start: '20:00', end: '22:00' },
];

export const SETTING_KEYS = {
  BUSINESS_NAME: 'business_name',
  BUSINESS_PHONE: 'business_phone',
  BUSINESS_EMAIL: 'business_email',
  WHATSAPP_NUMBER: 'whatsapp_number',
  ADDRESS: 'address',
  GOOGLE_MAPS_URL: 'google_maps_url',
  UPI_ID: 'upi_id',
  UPI_PAYEE_NAME: 'upi_payee_name',
  OPENING_TIME: 'opening_time',
  CLOSING_TIME: 'closing_time',
  DEFAULT_SLOT_DURATION: 'default_slot_duration',
  BUFFER_TIME: 'buffer_time',
  ADVANCE_BOOKING_LIMIT: 'advance_booking_limit',
  MIN_ADVANCE_BOOKING_TIME: 'min_advance_booking_time',
  CANCELLATION_WINDOW: 'cancellation_window',
  TAX_PERCENTAGE: 'tax_percentage',
  CURRENCY: 'currency',
  PAYMENT_VERIFICATION_TIMEOUT: 'payment_verification_timeout',
  BOOKING_HOLD_DURATION: 'booking_hold_duration',
} as const;

export const WHATSAPP_BASE_URL = 'https://wa.me';

export const formatCurrency = (amount: number | null | undefined): string => {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `${CURRENCY_SYMBOL}${val.toLocaleString('en-IN')}`;
};

export const formatTime12h = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
