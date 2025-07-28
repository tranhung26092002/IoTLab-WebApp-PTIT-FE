import { useState, useEffect } from 'react';
import { useFileView } from '../services/api/storageService';
import defaultImage from '../assets/default-device.png';
import { Provider } from '../types/user';

export const useUserAvatar = (avatarUrl?: string, avatarSource?: Provider) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [isLoading, setIsLoading] = useState(false);
    const { viewFile } = useFileView();

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const loadAvatar = async () => {
            if (avatarUrl) {
                setIsLoading(true);
                try {
                    // Nếu là avatar từ Google hoặc các provider khác, sử dụng trực tiếp URL
                    if (avatarSource && avatarSource !== Provider.LOCAL) {
                        setImageUrl(avatarUrl);
                    } else {
                        // Nếu là avatar local, gọi API để lấy URL
                        const { url, cleanup: cleanupFn } = await viewFile(avatarUrl);
                        setImageUrl(url);
                        cleanup = cleanupFn;
                    }
                } catch (error) {
                    console.error('Failed to load avatar:', error);
                    setImageUrl(defaultImage);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadAvatar();

        return () => {
            if (cleanup) cleanup();
            setImageUrl(defaultImage);
        };
    }, [avatarUrl, avatarSource]);

    return { imageUrl, isLoading };
}; 