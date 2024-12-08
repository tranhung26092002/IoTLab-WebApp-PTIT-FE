import { User } from '../../types/user';
import api from '../axios';

export const userService = {
    getUsers: () => api.get<User[]>('/users'),
    getUser: (id: number) => api.get<User>(`/users/${id}`),
    createUser: (data: Partial<User>) => api.post<User>('/users', data),
    updateUser: (id: number, data: Partial<User>) => api.put<User>(`/users/update/${id}`, data),
    deleteUser: (id: number) => api.delete(`/users/${id}`),
};