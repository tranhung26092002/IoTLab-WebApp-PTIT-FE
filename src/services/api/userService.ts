import { User } from '../../types/user';
import api from '../axios';
import { tokenStorage } from '../tokenStorage';

export const userService = {
    getUsers: () => api.get<User[]>('user/users'),

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
    updateMe: (data: Partial<User>) => {
        const accessToken = tokenStorage.getAccessToken();
        if (!accessToken) {
            throw new Error('Access token not available');
        }

        return api.put<User>('user/users/me', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },
    deleteUser: (id: number) => api.delete(`user/users/${id}`),
};