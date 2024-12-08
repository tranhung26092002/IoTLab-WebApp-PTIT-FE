import api from '../axios';
import { Notification } from '../../types/notification';

export const notificationService = {
    getAll: () => api.get<Notification[]>('/notifications'),
    markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
    delete: (id: string) => api.delete(`/notifications/${id}`),
};