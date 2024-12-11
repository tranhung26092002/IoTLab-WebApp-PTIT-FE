import api from '../axios';

interface ImageData {
    content: Blob;
    mimeType: string;
}

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
        const response = await api.get(`/storage/files/${fileName}`, {
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

    viewImage: async (fileName: string): Promise<ImageData> => {
        const response = await api.get(`/storage/images/${fileName}`, {
            responseType: 'blob'
        });

        const mimeType = response.headers['content-type'];
        return {
            content: response.data,
            mimeType: mimeType || 'image/jpeg' // fallback mime type
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

export const useImageView = () => {
    const viewImage = async (fileName: string) => {
        try {
            const imageData = await storageService.viewImage(fileName);
            const imageUrl = URL.createObjectURL(imageData.content);
            return {
                url: imageUrl,
                mimeType: imageData.mimeType,
                cleanup: () => URL.revokeObjectURL(imageUrl)
            };
        } catch (error) {
            console.error('Failed to view image:', error);
            throw error;
        }
    };

    return { viewImage };
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