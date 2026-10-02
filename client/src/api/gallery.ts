import api from './client';
import type { ApiResponse, GalleryImageDTO } from '@skylite/shared';

export const galleryApi = {
  getAll: async (category?: string): Promise<GalleryImageDTO[]> => {
    const params = category && category !== 'all' ? { category } : {};
    const { data } = await api.get<ApiResponse<GalleryImageDTO[]>>('/gallery', { params });
    return data.data || [];
  },
};
