import { useState, useEffect } from 'react';
import { useFileView } from '../services/api/storageService';
import defaultImage from '../assets/default-device.png';
import { Provider } from '../types/user';

export const useAvatar = (avatarUrl?: string, avatarSource?: Provider) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [isLoading, setIsLoading] = useState(false);
    const { viewFile } = useFileView();

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const loadAvatar = async () => {
            if (!avatarUrl) return;

            setIsLoading(true);
            try {
                if (avatarSource && avatarSource !== Provider.LOCAL) {
                    // Remote provider (e.g., Google): use URL directly
                    setImageUrl(avatarUrl);
                } else {
                    // Local storage: resolve signed URL via storage service
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
        };

        loadAvatar();

        return () => {
            if (cleanup) cleanup();
            setImageUrl(defaultImage);
        };
    }, [avatarUrl, avatarSource]);

    return { imageUrl, isLoading };
};
