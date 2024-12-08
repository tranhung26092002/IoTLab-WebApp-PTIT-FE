import axiosInstance from '../axios';
import { Task } from '../../types/task';

export const taskService = {
    getTasks: () => axiosInstance.get<Task[]>('/tasks'),
    createTask: (task: Partial<Task>) => axiosInstance.post<Task>('/tasks', task),
    updateTask: (id: string, task: Partial<Task>) => axiosInstance.put<Task>(`/tasks/${id}`, task),
    deleteTask: (id: string) => axiosInstance.delete(`/tasks/${id}`),
    approveTask: (id: string) => axiosInstance.patch(`/tasks/${id}/approve`),
};