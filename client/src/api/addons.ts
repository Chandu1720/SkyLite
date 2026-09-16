import api from './client';
import type { ApiResponse, AddonDTO } from '@skylite/shared';

export const addonApi = {
  getAll: async (): Promise<AddonDTO[]> => {
    const { data } = await api.get<ApiResponse<AddonDTO[]>>('/addons');
    return data.data || [];
  },

  getByOccasion: async (occasionId: string): Promise<AddonDTO[]> => {
    const { data } = await api.get<ApiResponse<AddonDTO[]>>(`/addons?occasion=${occasionId}`);
    return data.data || [];
  },
};
