import api from './client';
import type { ApiResponse, PackageDTO } from '@skylite/shared';

export const packageApi = {
  getAll: async (): Promise<PackageDTO[]> => {
    const { data } = await api.get<ApiResponse<PackageDTO[]>>('/packages');
    return data.data || [];
  },

  getByOccasion: async (occasionId: string): Promise<PackageDTO[]> => {
    const { data } = await api.get<ApiResponse<PackageDTO[]>>(`/packages?occasion=${occasionId}`);
    return data.data || [];
  },
};
