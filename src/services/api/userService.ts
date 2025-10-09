import { Attendance, ChangePasswordDto, User, UserFilter } from '../../types/user';
import api from '../axios';
import { tokenStorage } from '../tokenStorage';
import { PageResponse } from '../../types/pageResponse';
import { ApiResponse } from '../../types/apiResponse';
import { Instructor, Student } from '../../types/report';
import dayjs from 'dayjs';

export const userService = {
    getUsers: () => api.get<PageResponse<User>>('user/users'),

    filterUsers: async (
        filterParams: UserFilter,
        page = 0,
        size = 10
    ) => {
        const response = await api.get<PageResponse<User>>('user/users/filter', {
        params: {
            ...filterParams,
            page,
            size
        }
        });
        return response.data;
    },

    // get all attendances
    getAttendances: async (page = 0, size = 10, date: string = dayjs().format('YYYY-MM-DD')) => {
        const response = await api.get<PageResponse<Attendance>>('user/users/attendances', {
        params: {
            page,
            size,
            date
        }
        });
        return response.data;
    },

    getInstructors: () => api.get<PageResponse<Instructor>>('user/users/instructors'),

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

    getUserByUserName: (userName: string) => api.get<Student>(`user/users/username/${userName}`),

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

    changePassword: (data: ChangePasswordDto) =>
        api.post<{ message: string }>('user/users/change-password', data),

    deleteUser: (id: number) => api.delete(`user/users/${id}`),
};
