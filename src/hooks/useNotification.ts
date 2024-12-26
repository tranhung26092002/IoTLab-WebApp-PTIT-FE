import { useState, useEffect } from 'react';
import { Notification } from '../types/notification';
import notificationService from '../services/api/notificationService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useNotification = (userId: number) => {
    const queryClient = useQueryClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { data: initialNotifications, isLoading: isLoadingNotifications } = useQuery({
        queryKey: ['notifications', userId],
        queryFn: () => notificationService.getAllNotifications(userId),
        enabled: !!userId
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => notificationService.markAllAsRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: notificationService.deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
    });

    const deleteAllNotificationsMutation = useMutation({
        mutationFn: () => notificationService.deleteAllNotifications(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
    });

    useEffect(() => {
        if (initialNotifications) {
            setNotifications(initialNotifications);
        }
    }, [initialNotifications]);

    return {
        notifications,
        isLoading: isLoadingNotifications || 
                   markAsReadMutation.isPending || 
                   markAllAsReadMutation.isPending,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        deleteNotification: deleteNotificationMutation.mutate,
        deleteAllNotifications: deleteAllNotificationsMutation.mutate
    };
};