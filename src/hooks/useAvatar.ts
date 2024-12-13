import { useState, useEffect } from 'react';
import { useFileView } from '../services/api/storageService';
import defaultImage from '../assets/default-device.png';

export const useAvatar = (avatarUrl?: string) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [isLoading, setIsLoading] = useState(false);
    const { viewFile } = useFileView();

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const loadAvatar = async () => {
            if (avatarUrl) {
                setIsLoading(true);
                try {
                    const { url, cleanup: cleanupFn } = await viewFile(avatarUrl);
                    setImageUrl(url);
                    cleanup = cleanupFn;
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
    }, [avatarUrl]);

    return { imageUrl, isLoading };
};