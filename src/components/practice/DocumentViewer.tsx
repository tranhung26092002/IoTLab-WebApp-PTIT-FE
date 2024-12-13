import React, { useEffect } from 'react';
import { useDocument } from '../../hooks/useDocument';

interface DocumentViewerProps {
    fileUrl: string;
    onUrlReady: (url: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileUrl, onUrlReady }) => {
    const { url, isLoading } = useDocument(fileUrl);

    useEffect(() => {
        if (url && !isLoading) {
            onUrlReady(url);
        }
    }, [url, isLoading, onUrlReady]);

    return null;
};