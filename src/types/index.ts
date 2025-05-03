export interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export interface Document {
    id: number;
    filename: string;
    upload_timestamp: string;
}

export type TabType = 'chat' | 'iot' | 'admin';

export interface ChatResponse {
    answer: string;
    session_id: string;
    model: string;
}

export interface IoTResponse {
    answer: string;
    session_id: string;
    model: string;
}

export interface UploadResponse {
    message: string;
    file_id: number;
}

export interface DeleteResponse {
    message: string;
}

// Export các type mới
export * from './studentProgress';
export * from './student'; 