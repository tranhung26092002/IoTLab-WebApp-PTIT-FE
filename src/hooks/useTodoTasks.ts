// src/hooks/useTodoTasks.ts
import { useState, useEffect } from 'react';
import { TodoTask } from '../types/TodoTask';

const STORAGE_KEY = 'todo_tasks';

export const useTodoTasks = () => {
    const [tasks, setTasks] = useState<TodoTask[]>([]);
    const [loading, setLoading] = useState(true);

    // Load tasks from localStorage on mount
    useEffect(() => {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            try {
                setTasks(JSON.parse(storedTasks));
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }
        setLoading(false);
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const validateTask = (task: Partial<TodoTask>): boolean => {
        return !!(
            task.title &&
            task.description &&
            task.assignee &&
            task.startDate &&
            task.endDate &&
            task.priority &&
            task.status
        );
    };

    const addTask = (task: Omit<TodoTask, 'id'>) => {
        try {
            if (!validateTask(task)) {
                throw new Error('Invalid task data');
            }
            setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    };

    const updateTask = (id: string, updates: Partial<TodoTask>) => {
        try {
            setTasks(prev => prev.map(task =>
                task.id === id
                    ? {
                        ...task,
                        ...updates,
                        startDate: updates.startDate || task.startDate,
                        endDate: updates.endDate || task.endDate,
                        tags: updates.tags || task.tags,
                        updatedAt: new Date().toISOString(),
                    }
                    : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const deleteTask = (id: string) => {
        try {
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    };

    const toggleStatus = (id: string) => {
        try {
            setTasks(prev => prev.map(task =>
                task.id === id
                    ? {
                        ...task,
                        status: task.status === 'completed' ? 'todo' : 'completed',
                        updatedAt: new Date().toISOString(),
                    }
                    : task
            ));
        } catch (error) {
            console.error('Error toggling task status:', error);
            throw error;
        }
    };

    const sortTasks = (sortBy: string) => {
        const sortedTasks = [...tasks];
        switch (sortBy) {
            case 'priority':
                return sortedTasks.sort((a, b) =>
                    ['high', 'medium', 'low'].indexOf(a.priority) -
                    ['high', 'medium', 'low'].indexOf(b.priority)
                );
            case 'date':
                return sortedTasks.sort((a, b) =>
                    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                );
            default:
                return sortedTasks;
        }
    };

    const filterTasks = (status?: string, priority?: string) => {
        return tasks.filter(task =>
            (!status || task.status === status) &&
            (!priority || task.priority === priority)
        );
    };

    return {
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleStatus,
        sortTasks,
        filterTasks,
    };
};