import { useState, useEffect } from 'react';
import { useFileView } from '../services/api/storageService';

export const useVideo = (videoUrl?: string) => {
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { viewFile } = useFileView();

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const loadVideo = async () => {
            if (videoUrl) {
                setIsLoading(true);
                try {
                    const { url: fileUrl, cleanup: cleanupFn } = await viewFile(videoUrl);
                    setUrl(fileUrl);
                    cleanup = cleanupFn;
                } catch (error) {
                    console.error('Failed to load video:', error);
                    setUrl('');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadVideo();

        return () => {
            if (cleanup) cleanup();
            setUrl('');
        };
    }, [videoUrl]);

    return { url, isLoading };
};