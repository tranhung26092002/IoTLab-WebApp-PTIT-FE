import { useState, useEffect } from 'react';
import { useFileView } from '../services/api/storageService';

export const useDocument = (fileUrl?: string) => {
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { viewFile } = useFileView();

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const loadDocument = async () => {
            if (fileUrl) {
                setIsLoading(true);
                try {
                    const { url: docUrl, cleanup: cleanupFn } = await viewFile(fileUrl);
                    setUrl(docUrl);
                    cleanup = cleanupFn;
                } catch (error) {
                    console.error('Failed to load document:', error);
                    setUrl('');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadDocument();

        return () => {
            if (cleanup) cleanup();
            setUrl('');
        };
    }, [fileUrl]);

    return { url, isLoading };
};