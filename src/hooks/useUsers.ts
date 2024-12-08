import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api/userService';
import { User } from '../types/user';

export const useUsers = () => {
    const queryClient = useQueryClient();

    const { data: users, error, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await userService.getUsers();
            return response.data;
        },
    });

    const addUserMutation = useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<User> }) => userService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: number) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    return {
        users,
        error,
        isLoading,
        addUser: addUserMutation.mutate,
        updateUser: updateUserMutation.mutate,
        deleteUser: deleteUserMutation.mutate,
    };
};