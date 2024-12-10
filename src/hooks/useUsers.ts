import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api/userService';
import { User } from '../types/user';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';

export const useUsers = () => {
    const queryClient = useQueryClient();

    // Fetch all users
    const getAllUsers = useMutation<User[], AxiosError<ApiError>>({
        mutationFn: async () => {
            const response = await userService.getUsers();
            return response.data;
        },
        onError: handleApiError,
    });

    // // Fetch current user information
    // const getMeMutation = useMutation<User, AxiosError<ApiError>>({
    //     mutationFn: async () => {
    //         const response = await userService.getMe();
    //         return response.data;
    //     },
    //     onError: handleApiError,
    // });

    // Convert getMeMutation to useQuery
    const { data: me, isLoading: isLoadingMe, refetch: getMe } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await userService.getMe();
            return response.data;
        }
    });

    // Fetch a single user by ID
    const getUserMutation = useMutation<User, AxiosError<ApiError>, number>({
        mutationFn: async (id: number) => {
            const response = await userService.getUser(id);
            return response.data;
        },
        onError: handleApiError,
    });

    // Create a new user
    const addUserMutation = useMutation<User, AxiosError<ApiError>, Partial<User>>({
        mutationFn: async (data: Partial<User>) => {
            const response = await userService.createUser(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleSuccess('CREATE_USER');
        },
        onError: handleApiError,
    });

    // Update an existing user
    const updateUserMutation = useMutation<User, AxiosError<ApiError>, { id: number; data: Partial<User> }>({
        mutationFn: async ({ id, data }) => {
            const response = await userService.updateUser(id, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            handleSuccess('UPDATE_USER');
        },
        onError: handleApiError,
    });

    // const updateMeMutation = useMutation<User, AxiosError<ApiError>, { id: number; data: Partial<User> }>({
    //     mutationFn: async ({ data }) => {
    //         const response = await userService.updateMe(data);
    //         return response.data;
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['me'] }); // Làm mới cache cho dữ liệu 'me'
    //         handleSuccess('UPDATE_USER');
    //     },
    //     onError: handleApiError,
    // });

    const updateMeMutation = useMutation<User, AxiosError<ApiError>, { id: number; data: Partial<User> }>({
        mutationFn: async ({data}) => {
            const response = await userService.updateMe(data);
            return response.data;
        },
        onSuccess: (newData) => {
            // Update cache immediately
            queryClient.setQueryData(['me'], newData);
            // Refetch to ensure latest data
            getMe();
            handleSuccess('UPDATE_USER');
        },
        onError: handleApiError,
    });

    // Delete a user by ID
    const deleteUserMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: async (id: number) => {
            await userService.deleteUser(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleSuccess('DELETE_USER');
        },
        onError: handleApiError,
    });

    return {
        // Methods
        fetchAllUsers: getAllUsers.mutateAsync,
        // getMe: getMeMutation.mutateAsync,
        getMe,
        getUser: getUserMutation.mutateAsync,
        addUser: addUserMutation.mutate,
        updateUser: updateUserMutation.mutate,
        updateMe: updateMeMutation.mutate,
        deleteUser: deleteUserMutation.mutate,

        // Data and states
        allUsers: getAllUsers.data,
        // me: getMeMutation.data,
        me,
        isLoadingAllUsers: getAllUsers.isPending, // Changed from isLoading to isPending
        // isLoadingMe: getMeMutation.isPending,
        isLoadingMe,
        isAddingUser: addUserMutation.isPending,
        isUpdatingUser: updateUserMutation.isPending,
        isUpdatingMe: updateMeMutation.isPending,
        isDeletingUser: deleteUserMutation.isPending,

        // Errors
        getAllUsersError: getAllUsers.error,
        // getMeError: getMeMutation.error,
        getUserError: getUserMutation.error,
        addUserError: addUserMutation.error,
        updateUserError: updateUserMutation.error,
        updateMeError: updateMeMutation.error,
        deleteUserError: deleteUserMutation.error,
    };
};
