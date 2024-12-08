import { Chat } from '../../types/chat';
import { Message } from '../../types/message';
import api from '../axios';

export const chatService = {
    getAll: () => api.get<Chat[]>('/chats'),
    getById: (id: string) => api.get<Chat>(`/chats/${id}`),
    create: (data: Partial<Chat>) => api.post<Chat>('/chats', data),
    sendMessage: (chatId: string, message: Partial<Message>) =>
        api.post<Message>(`/chats/${chatId}/messages`, message),
    getMessages: (chatId: string) => api.get<Message[]>(`/chats/${chatId}/messages`),
};