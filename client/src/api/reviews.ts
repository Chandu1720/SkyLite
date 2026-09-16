import api from './client';
import type { ApiResponse, ReviewDTO, PublicSettings } from '@skylite/shared';

export const reviewApi = {
  getAll: async (): Promise<ReviewDTO[]> => {
    const { data } = await api.get<ApiResponse<ReviewDTO[]>>('/reviews');
    return data.data || [];
  },
};

export const settingsApi = {
  getPublic: async (): Promise<PublicSettings> => {
    const { data } = await api.get<ApiResponse<PublicSettings>>('/settings/public');
    return data.data!;
  },
};
