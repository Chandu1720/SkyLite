import api from './client';
import type { ApiResponse, SlotDTO } from '@skylite/shared';

export const slotApi = {
  getAvailable: async (theatreId: string, date: string): Promise<SlotDTO[]> => {
    const { data } = await api.get<ApiResponse<SlotDTO[]>>(
      `/slots?theatre=${theatreId}&date=${date}`
    );
    return data.data || [];
  },
};
