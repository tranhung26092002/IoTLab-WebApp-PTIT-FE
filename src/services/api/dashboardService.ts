import { Device } from '../../types/dashboard';
import { PageResponse } from '../../types/PageResponse';
import api from '../axios';

export const dashboardService = {
    getDevices: (page = 0, size = 10) =>
        api.get<PageResponse<Device>>('mqtt/devices', {
            params: { page, size }
        }),
};