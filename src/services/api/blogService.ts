import api from '../axios';
import { Blog } from '../../types/blog';

export const blogService = {
    getAll: () => api.get<Blog[]>('/blogs'),
    getById: (id: string) => api.get<Blog>(`/blogs/${id}`),
    create: (data: Partial<Blog>) => api.post<Blog>('/blogs', data),
    update: (id: string, data: Partial<Blog>) => api.put<Blog>(`/blogs/${id}`, data),
    delete: (id: string) => api.delete(`/blogs/${id}`),
};
