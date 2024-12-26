import { Notification } from '../../types/notification';
import api from '../axios';

const notificationService = {
    getAllNotifications: async (userId: number) => {
        const response = await api.get<Notification[]>(`/notification/${userId}`);
        return response.data;
    },

    markAsRead: async (notificationId: number) => {
        const response = await api.put<Notification>(`/notification/${notificationId}/read`);
        return response.data;
    },

    markAllAsRead: async (userId: number) => {
        const response = await api.put<Notification[]>(`/notification/${userId}/read-all`);
        return response.data;
    },

    deleteNotification: async (notificationId: number) => {
        await api.delete(`/notification/${notificationId}`);
    },

    deleteAllNotifications: async (userId: number) => {
        await api.delete(`/notification/${userId}/all`);
    },
};

export default notificationService;