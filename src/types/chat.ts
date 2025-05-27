export type TabType = 'chat' | 'iot' | 'admin';

export interface Chat {
    id: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

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

export interface Document {
    id: number;
    filename: string;
    upload_timestamp: string;
}

export interface UploadResponse {
    message: string;
    file_id: number;
}

export interface DeleteResponse {
    message: string;
} 