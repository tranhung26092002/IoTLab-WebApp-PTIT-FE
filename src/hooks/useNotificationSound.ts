import { useCallback } from 'react';
import { createNotificationSound } from '../utils/notificationSound';

export const useNotificationSound = () => {
    const playNotification = useCallback(() => {
        try {
            createNotificationSound();
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }, []);

    return { playNotification };
}; 
