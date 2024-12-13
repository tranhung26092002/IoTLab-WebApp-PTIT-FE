import api from '../axios';

export interface FileData {
    url: string;
    mimeType: string;
    cleanup: () => void;
}

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "video/mp4"
];

export const storageService = {
    // Upload file with timestamp
    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<string>('/storage/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Download file by name
    downloadFile: async (fileName: string): Promise<void> => {
        const response = await api.get(`/storage/download/${fileName}`, {
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    viewFile: async (fileName: string): Promise<FileData> => {
        const response = await api.get(`/storage/load/${fileName}`, {
            responseType: 'blob'
        });

        const mimeType = response.headers['content-type'] || 'application/octet-stream';

        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            throw new Error('Unsupported file type');
        }

        const blob = new Blob([response.data], { type: mimeType });
        const url = URL.createObjectURL(blob);

        return {
            url,
            mimeType,
            cleanup: () => URL.revokeObjectURL(url)
        };
    },

    // Delete file
    deleteFile: async (fileName: string): Promise<string> => {
        const response = await api.delete<string>(`/storage/files/${fileName}`);
        return response.data;
    },

    // List all files
    listFiles: async (): Promise<File[]> => {
        const response = await api.get<File[]>('/storage/files');
        return response.data;
    }
};

export const useFileUpload = () => {
    const uploadFile = async (file: File) => {
        try {
            return await storageService.uploadFile(file);
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    };

    return { uploadFile };
};

export const useFileView = () => {
    const viewFile = async (fileName: string) => {
        try {
            return await storageService.viewFile(fileName);
        } catch (error) {
            console.error('Failed to view file:', error);
            throw error;
        }
    };

    return { viewFile };
};

export const useFileDownload = () => {
    const downloadFile = async (fileName: string) => {
        try {
            await storageService.downloadFile(fileName);
        } catch (error) {
            console.error('File download failed:', error);
            throw error;
        }
    };

    return { downloadFile };
};

export const useFileOperations = () => {
    const deleteFile = async (fileName: string) => {
        try {
            return await storageService.deleteFile(fileName);
        } catch (error) {
            console.error('File deletion failed:', error);
            throw error;
        }
    };

    const listFiles = async () => {
        try {
            return await storageService.listFiles();
        } catch (error) {
            console.error('Failed to list files:', error);
            throw error;
        }
    };

    return { deleteFile, listFiles };
};