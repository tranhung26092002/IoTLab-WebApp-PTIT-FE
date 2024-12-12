import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../services/api/deviceService';
import { Device, BorrowRecord, DeviceFilterParams, PageResponse, BorrowDeviceRequest } from '../types/hardDevice';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';

export const useHardDevices = () => {
    const queryClient = useQueryClient();

    // Queries
    const useDevices = (page = 0, size = 10) =>
        useQuery<PageResponse<Device>>({
            queryKey: ['devices', page, size],
            queryFn: () => deviceService.getAllDevices(page, size)
        });

    const useDevice = (id: number) =>
        useQuery<Device>({
            queryKey: ['device', id],
            queryFn: () => deviceService.getDeviceById(id),
            enabled: !!id
        });

    const useDeviceByCode = (code: string) =>
        useQuery<Device>({
            queryKey: ['device', 'code', code],
            queryFn: () => deviceService.getDeviceByCode(code),
            enabled: !!code
        });

    const useFilteredDevices = (filters: DeviceFilterParams = {}) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<Device>>({
            queryKey: ['devices', 'filter', filters],
            queryFn: () => deviceService.filterDevices(
                filters,
                filters.page || 0,
                filters.size || 10
            ),
        });

        return {
            devices: data?.data || [],
            isLoading,
            metadata: data?.metadata,
            handlePageChange: (newPage: number) => {
                filters.page = newPage;
                refetch();
            },
            handleSizeChange: (newSize: number) => {
                filters.size = newSize;
                filters.page = 0;
                refetch();
            }
        };
    };

    // Mutations
    const createDeviceMutation = useMutation<
        Device,
        AxiosError<ApiError>,
        { device: Partial<Device>; file?: File }
    >({
        mutationFn: ({ device, file }) => deviceService.createDevice(device, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            handleSuccess('CREATE_DEVICE');
        },
        onError: handleApiError
    });

    const updateDeviceMutation = useMutation<
        Device,
        AxiosError<ApiError>,
        { id: number; device: Partial<Device>; file?: File }
    >({
        mutationFn: ({ id, device, file }) => deviceService.updateDevice(id, device, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            handleSuccess('UPDATE_DEVICE');
        },
        onError: handleApiError
    });

    const deleteDeviceMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: (id) => deviceService.deleteDevice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            handleSuccess('DELETE_DEVICE');
        },
        onError: handleApiError
    });

    // Borrow history queries
    const useBorrowHistory = (page = 0, size = 10) =>
        useQuery<PageResponse<BorrowRecord>>({
            queryKey: ['borrow-history', page, size],
            queryFn: () => deviceService.getBorrowHistory(page, size)
        });

    const useBorrowHistoryByUser = (page = 0, size = 10) =>
        useQuery<PageResponse<BorrowRecord>>({
            queryKey: ['borrow-history-user', page, size],
            queryFn: () => deviceService.getBorrowHistoryByUser(page, size)
        });

    const useDevicesBorrowedByUser = (page = 0, size = 10) =>
        useQuery<PageResponse<Device>>({
            queryKey: ['borrowed-devices', page, size],
            queryFn: () => deviceService.getDevicesBorrowedByUser(page, size),
            placeholderData: (previousData) => previousData // Smooth pagination transitions
        });

    const useDeviceBorrowHistory = (deviceId: number, page = 0, size = 10) =>
        useQuery<PageResponse<BorrowRecord>>({
            queryKey: ['device-borrow-history', deviceId, page, size],
            queryFn: () => deviceService.getBorrowHistoryByDevice(deviceId, page, size),
            enabled: !!deviceId
        });

    const borrowDeviceMutation = useMutation<
        BorrowRecord,
        AxiosError<ApiError>,
        BorrowDeviceRequest
    >({
        mutationFn: (request) => deviceService.borrowDevice(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            queryClient.invalidateQueries({ queryKey: ['borrow-history-user'] });
            queryClient.invalidateQueries({ queryKey: ['borrowed-devices'] });
            handleSuccess('BORROW_DEVICE');
        },
        onError: handleApiError
    });

    const returnDeviceMutation = useMutation<
        BorrowRecord,
        AxiosError<ApiError>,
        number
    >({
        mutationFn: (deviceId) => deviceService.returnDevice(deviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            queryClient.invalidateQueries({ queryKey: ['borrow-history-user'] });
            handleSuccess('RETURN_DEVICE');
        },
        onError: handleApiError
    });

    return {
        // Queries
        useDevices,
        useDevice,
        useDeviceByCode,
        useFilteredDevices,
        useBorrowHistory,
        useBorrowHistoryByUser,
        useDevicesBorrowedByUser,
        useDeviceBorrowHistory,

        // Mutation Methods
        createDevice: createDeviceMutation.mutate,
        updateDevice: updateDeviceMutation.mutate,
        deleteDevice: deleteDeviceMutation.mutate,
        borrowDevice: borrowDeviceMutation.mutate,
        returnDevice: returnDeviceMutation.mutate,

        // Loading States
        isCreating: createDeviceMutation.isPending,
        isUpdating: updateDeviceMutation.isPending,
        isDeleting: deleteDeviceMutation.isPending,
        isBorrowing: borrowDeviceMutation.isPending,
        isReturning: returnDeviceMutation.isPending,

        // Errors
        createError: createDeviceMutation.error,
        updateError: updateDeviceMutation.error,
        deleteError: deleteDeviceMutation.error,
        borrowError: borrowDeviceMutation.error,
        returnError: returnDeviceMutation.error
    };
};