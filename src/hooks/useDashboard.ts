import { useQuery } from '@tanstack/react-query';
import { PageResponse } from '../types/PageResponse';
import { Device } from '../types/dashboard';
import { dashboardService } from '../services/api/dashboardService';

export const useDashboard = (page = 0, size = 10) => {
    const { data: devices, isLoading } = useQuery<PageResponse<Device>>({
        queryKey: ['devices', page, size],
        queryFn: async () => {
            const response = await dashboardService.getDevices(page, size);
            return response.data;
        }
    });

    return { devices, isLoading };
}