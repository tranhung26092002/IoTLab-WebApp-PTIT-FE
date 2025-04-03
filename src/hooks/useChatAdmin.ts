import { useState, useCallback } from 'react';
import { Document, UploadResponse } from '../types';
import { chatApi } from '../services/api/chatApi';

export const useChatAdmin = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const loadDocuments = useCallback(async () => {
        try {
            const docs = await chatApi.getDocuments();
            setDocuments(docs);
        } catch (err) {
            console.error('Error loading documents:', err);
            setError('Không thể tải danh sách tài liệu.');
        }
    }, []);

    const handleFileUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        setUploadMessage('');
        setError(null);

        try {
            const response: UploadResponse = await chatApi.uploadDocument(file);
            setUploadMessage('Tải lên thành công!');
            await loadDocuments();
        } catch (err) {
            console.error('Error uploading document:', err);
            setUploadMessage('Lỗi khi tải lên tài liệu.');
            setError('Không thể tải lên tài liệu.');
        } finally {
            setIsUploading(false);
        }
    }, [loadDocuments]);

    const handleDeleteDocument = useCallback(async (fileId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;

        try {
            await chatApi.deleteDocument(fileId);
            await loadDocuments();
        } catch (err) {
            console.error('Error deleting document:', err);
            setError('Không thể xóa tài liệu.');
        }
    }, [loadDocuments]);

    return {
        documents,
        isUploading,
        uploadMessage,
        error,
        loadDocuments,
        handleFileUpload,
        handleDeleteDocument
    };
}; 