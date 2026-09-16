import api from './client';
import type { ApiResponse, OccasionDTO } from '@skylite/shared';

export const occasionApi = {
  getAll: async (): Promise<OccasionDTO[]> => {
    const { data } = await api.get<ApiResponse<OccasionDTO[]>>('/occasions');
    return data.data || [];
  },

  getBySlug: async (slug: string): Promise<OccasionDTO> => {
    const { data } = await api.get<ApiResponse<OccasionDTO>>(`/occasions/${slug}`);
    return data.data!;
  },
};
