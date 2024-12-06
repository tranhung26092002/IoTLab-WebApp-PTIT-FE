// src/utils/todoUtils.ts
import { TodoTask } from '../types/TodoTask';
import dayjs from 'dayjs';

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return '#ff4d4f';
        case 'medium': return '#faad14';
        default: return '#52c41a';
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return '#4f6f52';
        case 'in-progress': return '#86a789';
        default: return '#d2e3c8';
    }
};

export const sortTasks = (tasks: TodoTask[], sortBy: string) => {
    return [...tasks].sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                return ['high', 'medium', 'low'].indexOf(a.priority)
                    - ['high', 'medium', 'low'].indexOf(b.priority);
            case 'date':
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            case 'title':
                return a.title.localeCompare(b.title);
            case 'assignee':
                return a.assignee.localeCompare(b.assignee);
            default:
                return 0;
        }
    });
};

export const filterTasks = (
    tasks: TodoTask[],
    filters: { status?: string; priority?: string; assignee?: string }
) => {
    return tasks.filter(task => (
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.assignee || task.assignee === filters.assignee)
    ));
};

export const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY');
};

export const validateTask = (task: Partial<TodoTask>): boolean => {
    return !!(
        task.title?.trim() &&
        task.description?.trim() &&
        task.assignee &&
        task.startDate &&
        task.endDate &&
        task.priority &&
        task.status
    );
};

export const getPriorityLevel = (priority: string): number => {
    switch (priority) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
    }
};

export const isOverdue = (task: TodoTask): boolean => {
    return dayjs(task.endDate).isBefore(dayjs(), 'day');
};