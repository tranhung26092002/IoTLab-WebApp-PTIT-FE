
import api from '../axios';
import { CourseType as Course } from '../../types/course';

export const courseService = {
    getAll: () => api.get<Course[]>('/courses'),
    getById: (id: string) => api.get<Course>(`/courses/${id}`),
    create: (data: Partial<Course>) => api.post<Course>('/courses', data),
    update: (id: string, data: Partial<Course>) => api.put<Course>(`/courses/${id}`, data),
    delete: (id: string) => api.delete(`/courses/${id}`),
    enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`),
};