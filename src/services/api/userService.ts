import { PageResponse, User, ApiResponse } from '../../types/user';
import api from '../axios';
import { tokenStorage } from '../tokenStorage';

export const userService = {
    getUsers: (page = 0, size = 10) =>
        api.get<PageResponse<User>>('user/users', {
            params: { page, size }
        }),

    getMe: () => {
        const accessToken = tokenStorage.getAccessToken();
        if (!accessToken) {
            throw new Error('Access token not available');
        }

        return api.get<User>('user/users/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },

    getUser: (id: number) => api.get<User>(`user/users/${id}`),
    createUser: (data: Partial<User>) => api.post<User>('user/users', data),
    updateUser: (id: number, data: Partial<User>) => api.put<User>(`user/users/update/${id}`, data),
    updateMe: (formData: FormData) => {
        // Validate if formData has at least one required field
        if (!formData.has('user') && !formData.has('file')) {
            throw new Error('At least one of user or file must be provided');
        }

        return api.put<ApiResponse<User>>('user/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteUser: (id: number) => api.delete(`user/users/${id}`),
};