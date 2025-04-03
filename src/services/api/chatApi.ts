import axios from '../axios';
import { ChatResponse, IoTResponse, Document, UploadResponse } from '../../types';

const API_URL = 'http://localhost:8090';

export const chatApi = {
    // Gửi tin nhắn chat thông thường
    sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
        const response = await axios.post(`${API_URL}/chat`, {
            human_input: message,
            session_id: sessionId
        });
        return response.data;
    },

    // Gửi tin nhắn IoT
    sendIoTMessage: async (message: string, sessionId?: string): Promise<IoTResponse> => {
        const response = await axios.post(`${API_URL}/IoT`, {
            question: message,
            session_id: sessionId
        });
        return response.data;
    },

    // Lấy danh sách tài liệu
    getDocuments: async (): Promise<Document[]> => {
        const response = await axios.get(`${API_URL}/view-docs`);
        return response.data;
    },

    // Tải lên tài liệu
    uploadDocument: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/upload-doc`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Xóa tài liệu
    deleteDocument: async (fileId: number): Promise<void> => {
        await axios.post(`${API_URL}/delete-doc`, {
            file_id: fileId
        });
    }
}; 