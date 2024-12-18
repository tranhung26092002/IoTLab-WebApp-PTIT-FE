// services/deviceService.ts
import api from '../axios';
import { Device, BorrowRecord, DeviceFilterParams, PageResponse, BorrowDeviceRequest } from '../../types/hardDevice';

export const deviceService = {
  // Device CRUD operations
  getAllDevices: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<Device>>('device/devices', {
      params: { page, size }
    });
    return response.data;
  },

  getDeviceById: async (id: number) => {
    const response = await api.get<Device>(`device/devices/${id}`);
    return response.data;
  },

  getDeviceByCode: async (code: string) => {
    const response = await api.get<Device>('device/devices/code', {
      params: { code }
    });
    return response.data;
  },

  filterDevices: async (
    filterParams: DeviceFilterParams,
    page = 0,
    size = 10
  ) => {
    const response = await api.get<PageResponse<Device>>('device/devices/filter', {
      params: {
        ...filterParams,
        page,
        size
      }
    });
    return response.data;
  },

  createDevice: async (device: Partial<Device>, file?: File) => {
    const formData = new FormData();
    formData.append('device', JSON.stringify(device));
    if (file) {
      formData.append('file', file);
    }

    const response = await api.post<Device>('device/devices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateDevice: async (id: number, device: Partial<Device>, file?: File) => {
    const formData = new FormData();
    formData.append('device', JSON.stringify(device));
    if (file) {
      formData.append('file', file);
    }

    const response = await api.put<Device>(`device/devices/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteDevice: async (id: number) => {
    await api.delete(`device/devices/${id}`);
  },

  // Borrow Record operations
  getBorrowHistoryByUser: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<BorrowRecord>>('device/borrow-records/history-of-user', {
      params: { page, size }
    });
    return response.data;
  },

  getBorrowHistory: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<BorrowRecord>>('device/borrow-records/history', {
      params: { page, size }
    });
    return response.data;
  },

  getDevicesBorrowedByUser: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<Device>>('device/borrow-records/devices-of-user', {
      params: { page, size }
    });
    return response.data;
  },

  getBorrowHistoryByDevice: async (deviceId: number, page = 0, size = 10) => {
    const response = await api.get<PageResponse<BorrowRecord>>('device/borrow-records/history-of-device', {
      params: { deviceId, page, size }
    });
    return response.data;
  },

  borrowDevice: async (request: BorrowDeviceRequest) => {
    const response = await api.post<BorrowRecord>('device/borrow-records/borrow', null, {
      params: {
        deviceId: request.deviceId,
        note: request.note,
        expiredAt: request.expiredAt
      }
    });
    return response.data;
  },

  returnDevice: async (borrowRecordId: number) => {
    const response = await api.post<BorrowRecord>(`device/borrow-records/return/${borrowRecordId}`);
    return response.data;
  },
};