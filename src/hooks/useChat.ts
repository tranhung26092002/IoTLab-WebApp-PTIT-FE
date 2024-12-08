import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/api/chatService';
import { Message } from '../types/message';

export function useChat(chatId?: string) {
    const queryClient = useQueryClient();

    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ['chat', chatId, 'messages'],
        queryFn: () => chatService.getMessages(chatId!),
        enabled: !!chatId,
    });

    const sendMessage = useMutation({
        mutationFn: (message: Partial<Message>) =>
            chatService.sendMessage(chatId!, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', chatId, 'messages'] });
        },
    });

    return {
        messages,
        messagesLoading,
        sendMessage: sendMessage.mutate,
    };
}