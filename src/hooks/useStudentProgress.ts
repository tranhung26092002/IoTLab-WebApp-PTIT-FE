import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentProgressService } from '../services/api/studentProgressService';
import { StudentProgress } from '../types';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';

export const useStudentProgress = (studentId: number) => {
    const queryClient = useQueryClient();

    // Lấy danh sách tiến trình thực hành của sinh viên
    const { data: studentProgresses, isLoading: isLoadingProgresses } = useQuery<StudentProgress[], AxiosError<ApiError>>({
        queryKey: ['studentProgresses', studentId],
        queryFn: async () => {
            const response = await studentProgressService.getStudentProgress(studentId);
            return response;
        },
        enabled: !!studentId
    });

    // Lấy tiến trình thực hành của một bài thực hành cụ thể
    const getPracticeProgressMutation = useMutation<StudentProgress, AxiosError<ApiError>, number>({
        mutationFn: async (practiceId) => {
            const response = await studentProgressService.getPracticeProgress(studentId, practiceId);
            return response;
        },
        onError: handleApiError
    });

    // Bắt đầu bài thực hành
    const startPracticeMutation = useMutation<StudentProgress, AxiosError<ApiError>, number>({
        mutationFn: async (practiceId) => {
            const response = await studentProgressService.startPractice(studentId, practiceId);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentProgresses', studentId] });
            handleSuccess('UPDATE_PRACTICE');
        },
        onError: handleApiError
    });

    // Hoàn thành bài thực hành
    const completePracticeMutation = useMutation<StudentProgress, AxiosError<ApiError>, { 
        practiceId: number; 
        score?: number; 
        comment?: string;
    }>({
        mutationFn: async ({ practiceId, score, comment }) => {
            const response = await studentProgressService.completePractice(studentId, practiceId, score, comment);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentProgresses', studentId] });
            handleSuccess('UPDATE_PRACTICE');
        },
        onError: handleApiError
    });

    // Cập nhật điểm bài thực hành
    const updatePracticeScoreMutation = useMutation<StudentProgress, AxiosError<ApiError>, { 
        practiceId: number; 
        score: number; 
        comment?: string;
    }>({
        mutationFn: async ({ practiceId, score, comment }) => {
            const response = await studentProgressService.updatePracticeScore(studentId, practiceId, score, comment);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentProgresses', studentId] });
            handleSuccess('CHANGE_EVALUATION');
        },
        onError: handleApiError
    });

    // Kiểm tra có thể bắt đầu bài thực hành không
    const canStartPracticeMutation = useMutation<boolean, AxiosError<ApiError>, number>({
        mutationFn: async (practiceId) => {
            const response = await studentProgressService.canStartPractice(studentId, practiceId);
            return response;
        },
        onError: handleApiError
    });

    // Kiểm tra đã hoàn thành tất cả bài thực hành chưa
    const { data: hasCompletedAll, isLoading: isLoadingCompletion } = useQuery<boolean, AxiosError<ApiError>>({
        queryKey: ['hasCompletedAll', studentId],
        queryFn: async () => {
            const response = await studentProgressService.hasCompletedAllPractices(studentId);
            return response;
        },
        enabled: !!studentId
    });

    // Lấy tỷ lệ hoàn thành
    const { data: completionRate, isLoading: isLoadingRate } = useQuery<number, AxiosError<ApiError>>({
        queryKey: ['completionRate', studentId],
        queryFn: async () => {
            const response = await studentProgressService.getCompletionRate(studentId);
            return response;
        },
        enabled: !!studentId
    });

    return {
        // Data
        studentProgresses,
        hasCompletedAll,
        completionRate,

        // Methods
        getPracticeProgress: getPracticeProgressMutation.mutateAsync,
        startPractice: startPracticeMutation.mutateAsync,
        completePractice: completePracticeMutation.mutateAsync,
        updatePracticeScore: updatePracticeScoreMutation.mutateAsync,
        canStartPractice: canStartPracticeMutation.mutateAsync,

        // Loading states
        isLoadingProgresses,
        isLoadingCompletion,
        isLoadingRate,
        isGettingProgress: getPracticeProgressMutation.isPending,
        isStartingPractice: startPracticeMutation.isPending,
        isCompletingPractice: completePracticeMutation.isPending,
        isUpdatingScore: updatePracticeScoreMutation.isPending,
        isCheckingCanStart: canStartPracticeMutation.isPending,

        // Errors
        getProgressError: getPracticeProgressMutation.error,
        startPracticeError: startPracticeMutation.error,
        completePracticeError: completePracticeMutation.error,
        updateScoreError: updatePracticeScoreMutation.error,
        canStartError: canStartPracticeMutation.error
    };
}; 