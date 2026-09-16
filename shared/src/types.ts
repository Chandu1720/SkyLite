// ============================================================
// SkyLite Private Theatre — Shared Type Definitions
// ============================================================

import {
  BookingStatus,
  PaymentStatus,
  SlotStatus,
  TheatreStatus,
  AdminRole,
  PaymentType,
  PaymentMethod,
  RemainingPaymentStatus,
  BookingSource,
  AdvanceCalculationType,
} from './enums';

// ---- Theatre ----
export interface TheatreDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  location: string;
  facilities: string[];
  basePrice: number;
  status: TheatreStatus;
  images: TheatreImageDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface TheatreImageDTO {
  id: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
}

// ---- Occasion ----
export interface OccasionDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  theatres?: TheatreDTO[];
  packages?: PackageDTO[];
  addons?: AddonDTO[];
  createdAt: string;
  updatedAt: string;
}

// ---- Package ----
export interface PackageDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationMinutes: number;
  features: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Add-on ----
export interface AddonDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Slot ----
export interface SlotDTO {
  id: string;
  theatreId: string;
  date: string;
  startTime: string;
  endTime: string;
  priceOverride: number | null;
  status: SlotStatus;
  holdExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Customer ----
export interface CustomerDTO {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings?: number;
  totalSpent?: number;
  lastBookingDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Booking ----
export interface BookingDTO {
  id: string;
  bookingReference: string;
  customer: CustomerDTO;
  theatre: TheatreDTO;
  occasion: OccasionDTO;
  package: PackageDTO;
  slot: SlotDTO;
  addons: BookingAddonDTO[];
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  specialRequest: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentType: PaymentType;
  remainingPaymentStatus: RemainingPaymentStatus;
  bookingSource: BookingSource;
  discountCode?: string | null;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  holdExpiresAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  payments?: PaymentDTO[];
}

export interface BookingAddonDTO {
  id: string;
  addonId: string;
  addonName: string;
  addonPrice: number;
}

// ---- Payment ----
export interface PaymentDTO {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  upiUri: string | null;
  upiTransactionRef: string | null;
  screenshotUrl: string | null;
  status: PaymentStatus;
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- UPI ----
export interface UPIPaymentResponse {
  paymentId: string;
  bookingReference: string;
  amount: number;
  paymentType: PaymentType;
  remainingAmount: number;
  upiUri: string;
  qrCodeDataUrl: string;
  holdExpiresAt: string;
}

// ---- Settings ----
export interface SettingDTO {
  key: string;
  value: string;
  category: string;
}

export interface PublicSettings {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl: string;
  openingTime: string;
  closingTime: string;
  taxPercent: number;
  currency: string;
  allowAdvancePayment: boolean;
  advancePaymentType: AdvanceCalculationType;
  advancePaymentValue: number;
  allowFullPayment: boolean;
  allowPayAtVenue: boolean;
  welcomePopupEnabled?: boolean;
  welcomePopupTitle?: string;
  welcomePopupSubtitle?: string;
  welcomePopupCouponCode?: string;
  welcomePopupDiscountText?: string;
}

// ---- Coupon ----
export interface CouponDTO {
  id: string;
  code: string;
  description: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {}

// ---- Dashboard ----
export interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  availableSlots: number;
  bookedSlots: number;
  pendingPayments: number;
  upcomingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  onlineRevenue: number;
  offlineRevenue: number;
  pendingBalance: number;
}

// ---- Reports ----
export interface ReportData {
  dailyBookings: number;
  dailyRevenue: number;
  monthlyBookings: number;
  monthlyRevenue: number;
  totalRevenue: number;
  onlineRevenue: number;
  offlineRevenue: number;
  pendingBalance: number;
  popularOccasions: { name: string; count: number }[];
  popularPackages: { name: string; count: number }[];
  addonRevenue: number;
  cancellationCount: number;
  averageBookingValue: number;
}

// ---- Audit Log ----
export interface AuditLogDTO {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  createdAt: string;
}

// ---- Review ----
export interface ReviewDTO {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

// ---- Request Types ----
export interface CreateBookingRequest {
  occasionId: string;
  theatreId: string;
  slotId: string;
  packageId: string;
  addonIds: string[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guestCount: number;
  specialRequest?: string;
  paymentType?: PaymentType;
  discountCode?: string;
}

export interface PaymentConfirmRequest {
  upiTransactionRef: string;
}

export interface BookingStatusLookup {
  bookingReference: string;
  phone: string;
}

// ---- Admin Request Types ----
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface CreateTheatreRequest {
  name: string;
  description: string;
  capacity: number;
  location: string;
  facilities: string[];
  basePrice: number;
}

export interface CreateOccasionRequest {
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  theatreIds: string[];
  packageIds: string[];
  addonIds: string[];
}

export interface CreatePackageRequest {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  features: string[];
  isActive: boolean;
  displayOrder: number;
}

export interface CreateAddonRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CreateSlotRequest {
  theatreId: string;
  date: string;
  startTime: string;
  endTime: string;
  priceOverride?: number;
}

export interface AdminCreateBookingRequest {
  theatreId: string;
  occasionId: string;
  slotId: string;
  packageId: string;
  addonIds: string[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  specialRequest?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  advanceAmount?: number;
  discount?: number;
  bookingSource?: BookingSource;
}

export interface AdminWalkInBookingRequest {
  theatreId: string;
  occasionId: string;
  slotId: string;
  packageId: string;
  addonIds: string[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  specialRequest?: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  advancePaid?: number;
  discount?: number;
}

export interface CollectBalanceRequest {
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
}

export interface CustomSlotGenerateRequest {
  theatreId: string;
  startDate: string;
  endDate: string;
  openingTime: string; // e.g. "10:00"
  closingTime: string; // e.g. "23:00"
  slotDurationMinutes: number; // e.g. 120
  bufferMinutes: number; // e.g. 30
  priceOverride?: number;
}

// ---- API Response Wrapper ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

