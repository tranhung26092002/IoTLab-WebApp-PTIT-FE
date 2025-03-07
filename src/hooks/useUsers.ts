import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api/userService';
import { Attendance, ChangePasswordDto, User } from '../types/user';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/PageResponse';
import { Instructor, Student } from '../types/report';

export const useUsers = (options?: {
    page?: number;
    size?: number;
    enableUsers?: boolean;
    enableAttendance?: boolean;
    enableMe?: boolean;
    enableInstructors?: boolean;
}) => {
    const {
        page = 0,
        size = 10,
        enableUsers = false,
        enableAttendance = false,
        enableMe = false,
        enableInstructors = false
    } = options || {};    const queryClient = useQueryClient();

    // Fetch all users with pagination
    const { data: users, isLoading } = useQuery<PageResponse<User>>({
        queryKey: ['users', page, size],
        queryFn: async () => {
            const response = await userService.getUsers(page, size);
            return response.data;
        },
        enabled: enableUsers,
    });

    // get all Attendance
    const { data: attendanceResponse, isLoading: isLoadingAttendances } = useQuery<PageResponse<Attendance>>({
        queryKey: ['attendances'],
        queryFn: async () => {
            const response = await userService.getAttendances();
            return response.data;
        },
        enabled: enableAttendance,
    });

    // get all instructors
    const { data: instructorResponse, isLoading: isLoadingInstructors } = useQuery<PageResponse<Instructor>>({
        queryKey: ['instructors'],
        queryFn: async () => {
            const response = await userService.getInstructors();
            return response.data;
        },
        enabled: enableInstructors,
    });

    // Get current user
    const { data: me, isLoading: isLoadingMe, refetch: getMe } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await userService.getMe();
            return response.data;
        },
        enabled: enableMe,
    });

    // Get single user
    const getUserMutation = useMutation<User, AxiosError<ApiError>, number>({
        mutationFn: async (id: number) => {
            const response = await userService.getUser(id);
            return response.data;
        },
        onError: handleApiError,
    });

    // Get user by username
    const getStudentMutation = useMutation<Student, AxiosError<ApiError>, string>({
        mutationFn: async (userName: string) => {
            const response = await userService.getUserByUserName(userName);
            return response.data;
        },
        onError: handleApiError,
    });

    // Create user
    const addUserMutation = useMutation<User, AxiosError<ApiError>, Partial<User>>({
        mutationFn: async (data) => {
            const response = await userService.createUser(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleSuccess('CREATE_USER');
        },
        onError: handleApiError,
    });

    // Update user
    const updateUserMutation = useMutation<User, AxiosError<ApiError>, { id: number; data: Partial<User> }>({
        mutationFn: async ({ id, data }) => {
            const response = await userService.updateUser(id, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleSuccess('UPDATE_USER');
        },
        onError: handleApiError,
    });

    // Update current user
    const updateMeMutation = useMutation<User, AxiosError<ApiError>, { data: Partial<User>; file?: File }>({
        mutationFn: async ({ data, file }) => {
            const formData = new FormData();
            formData.append('user', JSON.stringify(data));
            if (file) {
                formData.append('file', file);
            }
            const response = await userService.updateMe(formData);
            return response.data.data;
        },
        onSuccess: (newData) => {
            queryClient.setQueryData(['me'], newData);
            queryClient.invalidateQueries({ queryKey: ['me'] });
            handleSuccess('UPDATE_USER');
        },
        onError: handleApiError,
    });

    // Change password
    const changePasswordMutation = useMutation<{ message: string }, AxiosError<ApiError>, ChangePasswordDto>({
        mutationFn: async (data) => {
            const response = await userService.changePassword(data);
            return response.data;
        },
        onSuccess: () => {
            handleSuccess('CHANGE_PASSWORD');
        },
        onError: handleApiError
    });

    // Delete user
    const deleteUserMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            await userService.deleteUser(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleSuccess('DELETE_USER');
        },
        onError: handleApiError,
    });

    return {
        // Data
        users,
        me,
        instructors: instructorResponse?.data || [],
        attendances: attendanceResponse?.data || [],

        // Methods
        getMe,
        getUser: getUserMutation.mutateAsync,
        getStudent: getStudentMutation.mutateAsync,
        addUser: addUserMutation.mutate,
        updateUser: updateUserMutation.mutate,
        updateMe: updateMeMutation.mutate,
        changePassword: changePasswordMutation.mutate,
        deleteUser: deleteUserMutation.mutate,

        // Loading states
        isLoading,
        isLoadingMe,
        isLoadingInstructors,
        isLoadingAttendances,
        isAddingUser: addUserMutation.isPending,
        isUpdatingUser: updateUserMutation.isPending,
        isUpdatingMe: updateMeMutation.isPending,
        isChangingPassword: changePasswordMutation.isPending,
        isDeletingUser: deleteUserMutation.isPending,

        // Errors
        getUserError: getUserMutation.error,
        getStudentError: getStudentMutation.error,
        addUserError: addUserMutation.error,
        updateUserError: updateUserMutation.error,
        updateMeError: updateMeMutation.error,
        changePasswordError: changePasswordMutation.error,
        deleteUserError: deleteUserMutation.error,
    };
};