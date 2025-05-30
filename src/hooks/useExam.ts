import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examService } from '../services/api/examService';
import { Exam } from '../types/exam';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/PageResponse';

export const useExam = () => {
    const queryClient = useQueryClient();

    // Get all exams
    const { data: exams, isLoading } = useQuery<PageResponse<Exam>, AxiosError<ApiError>>({
        queryKey: ['exams'],
        queryFn: async () => {
            const response = await examService.getExams();
            return response.data;
        }
    });

    // Get random exam mutation
    const getRandomExamMutation = useMutation<Exam, AxiosError<ApiError>>({
        mutationFn: async () => {
            const response = await examService.getRandomExam();
            return response.data;
        },
        onError: handleApiError
    });

    // Get single exam
    const getExamMutation = useMutation<Exam, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await examService.getExam(id);
            return response.data;
        },
        onError: handleApiError
    });

    // Create exam
    const createExamMutation = useMutation<Exam, AxiosError<ApiError>, Partial<Exam>>({
        mutationFn: async (exam) => {
            const response = await examService.createExam(exam);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            handleSuccess('CREATE_EXAM');
        },
        onError: handleApiError
    });

    // Update exam
    const updateExamMutation = useMutation<Exam, AxiosError<ApiError>, { id: number; exam: Partial<Exam> }>({
        mutationFn: async ({ id, exam }) => {
            const response = await examService.updateExam(id, exam);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            handleSuccess('UPDATE_EXAM');
        },
        onError: handleApiError
    });

    // Delete exam
    const deleteExamMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            await examService.deleteExam(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            handleSuccess('DELETE_EXAM');
        },
        onError: handleApiError
    });

    return {
        // Data
        exams,

        // Methods
        getExam: getExamMutation.mutateAsync,
        getRandomExam: getRandomExamMutation.mutateAsync,
        createExam: createExamMutation.mutateAsync,
        updateExam: updateExamMutation.mutateAsync,
        deleteExam: deleteExamMutation.mutateAsync,

        // Loading states
        isLoading,
        isGettingRandom: getRandomExamMutation.isPending,
        isCreating: createExamMutation.isPending,
        isUpdating: updateExamMutation.isPending,
        isDeleting: deleteExamMutation.isPending,

        // Errors
        getExamError: getExamMutation.error,
        getRandomExamError: getRandomExamMutation.error,
        createExamError: createExamMutation.error,
        updateExamError: updateExamMutation.error,
        deleteExamError: deleteExamMutation.error
    };
}; 