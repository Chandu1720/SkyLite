import api from './client';
import type { ApiResponse, TheatreDTO } from '@skylite/shared';

export const theatreApi = {
  getAll: async (): Promise<TheatreDTO[]> => {
    const { data } = await api.get<ApiResponse<TheatreDTO[]>>('/theatres');
    return data.data || [];
  },

  getById: async (id: string): Promise<TheatreDTO> => {
    const { data } = await api.get<ApiResponse<TheatreDTO>>(`/theatres/${id}`);
    return data.data!;
  },

  getBySlug: async (slug: string): Promise<TheatreDTO> => {
    const { data } = await api.get<ApiResponse<TheatreDTO>>(`/theatres/slug/${slug}`);
    return data.data!;
  },
};
