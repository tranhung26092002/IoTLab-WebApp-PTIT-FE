// services/hardDeviceApi.ts
import { HardDevice, LendingRecord, FilterParams } from '../../types/hardDevice';
import api from '../axios';

export const deviceService = {
    getDevices: async (params: FilterParams) => {
        const response = await api.get<HardDevice[]>(`/devices`, { params });
        return response.data;
    },

    getLendingHistory: async (deviceId?: string) => {
        const response = await api.get<LendingRecord[]>(`/lending-history`, {
            params: { deviceId }
        });
        return response.data;
    },

    lendDevice: async (deviceId: string, studentId: string) => {
        return api.post(`/lend`, { deviceId, studentId });
    },

    returnDevice: async (lendingId: string) => {
        return api.post(`/return/${lendingId}`);
    }
};