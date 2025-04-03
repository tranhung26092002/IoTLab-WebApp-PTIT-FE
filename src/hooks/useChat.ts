import { useState, useCallback } from 'react';
import { TabType, ChatResponse, IoTResponse } from '../types';
import { chatApi } from '../services/api/chatApi';

export interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
    read: boolean;
}

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string, tabType: TabType) => {
        if (!content.trim()) return;

        setIsLoading(true);
        setError(null);

        // Thêm tin nhắn của người dùng
        const userMessage: Message = {
            content,
            isUser: true,
            timestamp: new Date(),
            read: true
        };

        setMessages(prev => [...prev, userMessage]);

        try {
            let response: ChatResponse | IoTResponse;
            
            // Gọi API tương ứng với tab đang chọn
            if (tabType === 'chat') {
                response = await chatApi.sendMessage(content, sessionId);
            } else if (tabType === 'iot') {
                response = await chatApi.sendIoTMessage(content, sessionId);
            } else {
                throw new Error('Invalid tab type');
            }

            // Lưu session ID
            setSessionId(response.session_id);

            // Thêm tin nhắn của AI
            const aiMessage: Message = {
                content: response.answer,
                isUser: false,
                timestamp: new Date(),
                read: false
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.');
            
            const errorMessage: Message = {
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
                isUser: false,
                timestamp: new Date(),
                read: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setSessionId(undefined);
        setError(null);
    }, []);

    return {
        messages,
        sessionId,
        isLoading,
        error,
        sendMessage,
        clearChat
    };
}; 