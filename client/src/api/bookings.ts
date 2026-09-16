import api from './client';
import type {
  ApiResponse,
  BookingDTO,
  CreateBookingRequest,
  UPIPaymentResponse,
  PaymentConfirmRequest,
} from '@skylite/shared';

export const bookingApi = {
  create: async (data: CreateBookingRequest): Promise<BookingDTO> => {
    const { data: res } = await api.post<ApiResponse<BookingDTO>>('/bookings', data);
    return res.data!;
  },

  getByRef: async (ref: string): Promise<BookingDTO> => {
    const { data } = await api.get<ApiResponse<BookingDTO>>(`/bookings/${ref}`);
    return data.data!;
  },

  initiatePayment: async (ref: string): Promise<UPIPaymentResponse> => {
    const { data } = await api.post<ApiResponse<UPIPaymentResponse>>(
      `/bookings/${ref}/payment/initiate`
    );
    return data.data!;
  },

  submitPaymentConfirmation: async (
    ref: string,
    confirmation: PaymentConfirmRequest,
    screenshot?: File
  ): Promise<BookingDTO> => {
    const formData = new FormData();
    formData.append('upiTransactionRef', confirmation.upiTransactionRef);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    const { data } = await api.post<ApiResponse<BookingDTO>>(
      `/bookings/${ref}/payment/confirm`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data!;
  },

  lookupStatus: async (bookingReference: string, phone: string): Promise<BookingDTO> => {
    const { data } = await api.get<ApiResponse<BookingDTO>>(
      `/bookings/status?ref=${bookingReference}&phone=${phone}`
    );
    return data.data!;
  },

  validateCoupon: async (code: string, subtotal: number): Promise<{
    valid: boolean;
    discount?: number;
    discountAmount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number | null;
    message?: string;
    description?: string | null;
  }> => {
    const { data } = await api.post<ApiResponse<{
      valid: boolean;
      discount?: number;
      discountAmount?: number;
      discountType?: 'PERCENTAGE' | 'FIXED';
      discountValue?: number;
      minOrderAmount?: number;
      maxDiscountAmount?: number | null;
      message?: string;
      description?: string | null;
    }>>(
      '/coupons/validate',
      { code, subtotal }
    );
    return data.data!;
  },
};
