import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 phút
            gcTime: 10 * 60 * 1000, // 10 phút
            retry: 1,
        },
    },
});