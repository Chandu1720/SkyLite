import api from './client';
import type {
  ApiResponse,
  DashboardStats,
  BookingDTO,
  TheatreDTO,
  OccasionDTO,
  PackageDTO,
  AddonDTO,
  SlotDTO,
  CustomerDTO,
  PaymentDTO,
  SettingDTO,
  AuditLogDTO,
  ReportData,
  ReviewDTO,
  CreateTheatreRequest,
  CreateOccasionRequest,
  CreatePackageRequest,
  CreateAddonRequest,
  CreateSlotRequest,
  AdminCreateBookingRequest,
  AdminLoginRequest,
} from '@skylite/shared';

// ---- Auth ----
export const authApi = {
  login: async (credentials: AdminLoginRequest) => {
    const { data } = await api.post<ApiResponse<{ token: string; admin: { id: string; email: string; name: string; role: string } }>>('/auth/login', credentials);
    return data.data!;
  },
  getMe: async () => {
    const { data } = await api.get<ApiResponse<{ id: string; email: string; name: string; role: string }>>('/auth/me');
    return data.data!;
  },
};

// ---- Admin Dashboard ----
export const adminApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return data.data!;
  },

  // ---- Bookings ----
  getBookings: async (params?: Record<string, string>): Promise<{ bookings: BookingDTO[]; total: number }> => {
    const { data } = await api.get<ApiResponse<{ bookings: BookingDTO[]; total: number }>>('/admin/bookings', { params });
    return data.data!;
  },
  getBooking: async (id: string): Promise<BookingDTO> => {
    const { data } = await api.get<ApiResponse<BookingDTO>>(`/admin/bookings/${id}`);
    return data.data!;
  },
  createBooking: async (booking: AdminCreateBookingRequest): Promise<BookingDTO> => {
    const { data } = await api.post<ApiResponse<BookingDTO>>('/admin/bookings', booking);
    return data.data!;
  },
  createWalkInBooking: async (booking: any): Promise<BookingDTO> => {
    const { data } = await api.post<ApiResponse<BookingDTO>>('/admin/bookings/walkin', booking);
    return data.data!;
  },
  collectBalance: async (id: string, payload: { amount: number; paymentMethod: string; transactionRef?: string }): Promise<BookingDTO> => {
    const { data } = await api.post<ApiResponse<BookingDTO>>(`/admin/bookings/${id}/collect-balance`, payload);
    return data.data!;
  },
  cancelBooking: async (id: string, reason?: string): Promise<BookingDTO> => {
    const { data } = await api.post<ApiResponse<BookingDTO>>(`/admin/bookings/${id}/cancel`, { reason });
    return data.data!;
  },
  rescheduleBooking: async (id: string, newSlotId: string): Promise<BookingDTO> => {
    const { data } = await api.post<ApiResponse<BookingDTO>>(`/admin/bookings/${id}/reschedule`, { newSlotId });
    return data.data!;
  },

  // ---- Theatres ----
  getTheatres: async (): Promise<TheatreDTO[]> => {
    const { data } = await api.get<ApiResponse<TheatreDTO[]>>('/admin/theatres');
    return data.data || [];
  },
  createTheatre: async (theatre: CreateTheatreRequest): Promise<TheatreDTO> => {
    const { data } = await api.post<ApiResponse<TheatreDTO>>('/admin/theatres', theatre);
    return data.data!;
  },
  updateTheatre: async (id: string, theatre: Partial<CreateTheatreRequest>): Promise<TheatreDTO> => {
    const { data } = await api.put<ApiResponse<TheatreDTO>>(`/admin/theatres/${id}`, theatre);
    return data.data!;
  },

  // ---- Occasions ----
  getOccasions: async (): Promise<OccasionDTO[]> => {
    const { data } = await api.get<ApiResponse<OccasionDTO[]>>('/admin/occasions');
    return data.data || [];
  },
  createOccasion: async (occasion: CreateOccasionRequest): Promise<OccasionDTO> => {
    const { data } = await api.post<ApiResponse<OccasionDTO>>('/admin/occasions', occasion);
    return data.data!;
  },
  updateOccasion: async (id: string, occasion: Partial<CreateOccasionRequest>): Promise<OccasionDTO> => {
    const { data } = await api.put<ApiResponse<OccasionDTO>>(`/admin/occasions/${id}`, occasion);
    return data.data!;
  },
  deleteOccasion: async (id: string): Promise<void> => {
    await api.delete(`/admin/occasions/${id}`);
  },

  // ---- Packages ----
  getPackages: async (): Promise<PackageDTO[]> => {
    const { data } = await api.get<ApiResponse<PackageDTO[]>>('/admin/packages');
    return data.data || [];
  },
  createPackage: async (pkg: CreatePackageRequest): Promise<PackageDTO> => {
    const { data } = await api.post<ApiResponse<PackageDTO>>('/admin/packages', pkg);
    return data.data!;
  },
  updatePackage: async (id: string, pkg: Partial<CreatePackageRequest>): Promise<PackageDTO> => {
    const { data } = await api.put<ApiResponse<PackageDTO>>(`/admin/packages/${id}`, pkg);
    return data.data!;
  },

  // ---- Add-ons ----
  getAddons: async (): Promise<AddonDTO[]> => {
    const { data } = await api.get<ApiResponse<AddonDTO[]>>('/admin/addons');
    return data.data || [];
  },
  createAddon: async (addon: CreateAddonRequest): Promise<AddonDTO> => {
    const { data } = await api.post<ApiResponse<AddonDTO>>('/admin/addons', addon);
    return data.data!;
  },
  updateAddon: async (id: string, addon: Partial<CreateAddonRequest>): Promise<AddonDTO> => {
    const { data } = await api.put<ApiResponse<AddonDTO>>(`/admin/addons/${id}`, addon);
    return data.data!;
  },

  // ---- Slots ----
  getSlots: async (params?: Record<string, string>): Promise<SlotDTO[]> => {
    const { data } = await api.get<ApiResponse<SlotDTO[]>>('/admin/slots', { params });
    return data.data || [];
  },
  createSlot: async (slot: CreateSlotRequest): Promise<SlotDTO> => {
    const { data } = await api.post<ApiResponse<SlotDTO>>('/admin/slots', slot);
    return data.data!;
  },
  createBulkSlots: async (slots: { theatreId: string; startDate: string; endDate: string }): Promise<SlotDTO[]> => {
    const { data } = await api.post<ApiResponse<SlotDTO[]>>('/admin/slots/bulk', slots);
    return data.data || [];
  },
  createCustomSlots: async (params: any): Promise<{ slotsCreated: number; slotCountPerDay: number }> => {
    const { data } = await api.post<ApiResponse<{ slotsCreated: number; slotCountPerDay: number }>>('/admin/slots/custom', params);
    return data.data!;
  },
  updateSlot: async (id: string, slot: Partial<CreateSlotRequest>): Promise<SlotDTO> => {
    const { data } = await api.put<ApiResponse<SlotDTO>>(`/admin/slots/${id}`, slot);
    return data.data!;
  },
  blockSlot: async (id: string): Promise<SlotDTO> => {
    const { data } = await api.post<ApiResponse<SlotDTO>>(`/admin/slots/${id}/block`);
    return data.data!;
  },
  unblockSlot: async (id: string): Promise<SlotDTO> => {
    const { data } = await api.post<ApiResponse<SlotDTO>>(`/admin/slots/${id}/unblock`);
    return data.data!;
  },

  // ---- Payments ----
  getPendingPayments: async (): Promise<PaymentDTO[]> => {
    const { data } = await api.get<ApiResponse<PaymentDTO[]>>('/admin/payments/pending');
    return data.data || [];
  },
  verifyPayment: async (id: string): Promise<PaymentDTO> => {
    const { data } = await api.post<ApiResponse<PaymentDTO>>(`/admin/payments/${id}/verify`);
    return data.data!;
  },
  rejectPayment: async (id: string, reason: string): Promise<PaymentDTO> => {
    const { data } = await api.post<ApiResponse<PaymentDTO>>(`/admin/payments/${id}/reject`, { reason });
    return data.data!;
  },

  // ---- Customers ----
  getCustomers: async (params?: Record<string, string>): Promise<{ customers: CustomerDTO[]; total: number }> => {
    const { data } = await api.get<ApiResponse<{ customers: CustomerDTO[]; total: number }>>('/admin/customers', { params });
    return data.data!;
  },
  getCustomer: async (id: string): Promise<CustomerDTO> => {
    const { data } = await api.get<ApiResponse<CustomerDTO>>(`/admin/customers/${id}`);
    return data.data!;
  },

  // ---- Calendar ----
  getCalendar: async (params?: Record<string, string>): Promise<SlotDTO[]> => {
    const { data } = await api.get<ApiResponse<SlotDTO[]>>('/admin/calendar', { params });
    return data.data || [];
  },

  // ---- Reports ----
  getReports: async (params?: Record<string, string>): Promise<ReportData> => {
    const { data } = await api.get<ApiResponse<ReportData>>('/admin/reports', { params });
    return data.data!;
  },

  // ---- Settings ----
  getSettings: async (): Promise<SettingDTO[]> => {
    const { data } = await api.get<ApiResponse<SettingDTO[]>>('/admin/settings');
    return data.data || [];
  },
  updateSettings: async (settings: { key: string; value: string }[]): Promise<void> => {
    await api.put('/admin/settings', { settings });
  },

  // ---- Audit Logs ----
  getAuditLogs: async (params?: Record<string, string>): Promise<{ logs: AuditLogDTO[]; total: number }> => {
    const { data } = await api.get<ApiResponse<{ logs: AuditLogDTO[]; total: number }>>('/admin/audit-logs', { params });
    return data.data!;
  },

  // ---- Reviews ----
  getReviews: async (): Promise<ReviewDTO[]> => {
    const { data } = await api.get<ApiResponse<ReviewDTO[]>>('/admin/reviews');
    return data.data || [];
  },
  createReview: async (review: Omit<ReviewDTO, 'id' | 'createdAt'>): Promise<ReviewDTO> => {
    const { data } = await api.post<ApiResponse<ReviewDTO>>('/admin/reviews', review);
    return data.data!;
  },
  updateReview: async (id: string, review: Partial<ReviewDTO>): Promise<ReviewDTO> => {
    const { data } = await api.put<ApiResponse<ReviewDTO>>(`/admin/reviews/${id}`, review);
    return data.data!;
  },

  // ---- Coupons ----
  getCoupons: async (): Promise<CouponDTO[]> => {
    const { data } = await api.get<ApiResponse<CouponDTO[]>>('/admin/coupons');
    return data.data || [];
  },
  createCoupon: async (coupon: CreateCouponInput): Promise<CouponDTO> => {
    const { data } = await api.post<ApiResponse<CouponDTO>>('/admin/coupons', coupon);
    return data.data!;
  },
  updateCoupon: async (id: string, coupon: UpdateCouponInput): Promise<CouponDTO> => {
    const { data } = await api.put<ApiResponse<CouponDTO>>(`/admin/coupons/${id}`, coupon);
    return data.data!;
  },
  deleteCoupon: async (id: string): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`);
  },

  // ---- Media Upload ----
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post<ApiResponse<{ url: string; filename: string }>>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data!;
  },
};

export const publicApi = {
  validateCoupon: async (code: string, subtotal: number): Promise<{ valid: boolean; code: string; discount: number; discountType: string; discountValue: number; description?: string }> => {
    const { data } = await api.post<ApiResponse<any>>('/coupons/validate', { code, subtotal });
    return data.data!;
  },
};

