import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentExamService } from '../services/api/studentExamService';
import { StudentExam, StudentAnswerListDTO,StudentExamResult } from '../types/exam';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/PageResponse';

export const useStudentExam = (options?: {
    enableStudentExams?: boolean;
    studentId?: number;
    studentExamId?: number;
    page?: number;
    size?: number;
}) => {
    const {
        enableStudentExams = false,
        studentId,
        studentExamId,
        page = 0,
        size = 10
    } = options || {};
    const queryClient = useQueryClient();

    // Get all student exams
    const { data: studentExams, isLoading: isLoadingExams } = useQuery<PageResponse<StudentExam>, AxiosError<ApiError>>({
        queryKey: ['student-exams', page, size],
        queryFn: async () => {
            const response = await studentExamService.getAllStudentExams({ page, size });
            return response.data;
        },
        enabled: enableStudentExams
    });

    // Get student exam by ID
    const getStudentExam = useMutation<StudentExam, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentExamById(id);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['student-exam', studentExamId], data);
        }
    });

    // Get current exam for student
    const getCurrentExam = useMutation<StudentExam, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getCurrentExam(id);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['current-exam', studentId], data);
        }
    });

    // Get student exam result
    const getExamResult = useMutation<StudentExamResult, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentExamResult(id);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['exam-result', studentExamId], data);
        }
    });

    // Get student exam details
    const getExamDetails = useMutation<StudentExam, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentExamDetails(id);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['exam-details', studentExamId], data);
        }
    });

    // Submit exam mutation
    const submitExamMutation = useMutation<
        StudentExamResult,
        AxiosError<ApiError>,
        { studentExamId: number; answers: StudentAnswerListDTO; images?: File[] }
    >({
        mutationFn: async ({ studentExamId, answers, images }) => {
            const response = await studentExamService.submitExam(studentExamId, answers, images);
            return response.data;
        },
        onSuccess: () => {
            handleSuccess('SUBMIT_EXAM');
            queryClient.invalidateQueries({ queryKey: ['exam-result', studentExamId] });
            queryClient.invalidateQueries({ queryKey: ['student-exam', studentExamId] });
        },
        onError: (error) => {
            handleApiError(error);
        }
    });

    // Grade essay answer mutation
    const gradeEssayMutation = useMutation<
        StudentExamResult,
        AxiosError<ApiError>,
        { answerId: number; score: number }
    >({
        mutationFn: async ({ answerId, score }) => {
            const response = await studentExamService.gradeEssayAnswer(answerId, score);
            return response.data;
        },
        onSuccess: () => {
            handleSuccess('GRADE_ESSAY');
            queryClient.invalidateQueries({ queryKey: ['exam-result', studentExamId] });
        },
        onError: (error) => {
            handleApiError(error);
        }
    });

    return {
        // Queries
        studentExams,
        getStudentExam,
        getCurrentExam,
        getExamResult,
        getExamDetails,
        
        // Loading states
        isLoadingExams,
        isLoadingExam: getStudentExam.isPending,
        isLoadingCurrentExam: getCurrentExam.isPending,
        isLoadingResult: getExamResult.isPending,
        isLoadingDetails: getExamDetails.isPending,
        
        // Mutations
        submitExam: submitExamMutation.mutateAsync,
        gradeEssay: gradeEssayMutation.mutate,
        
        // Mutation states
        isSubmitting: submitExamMutation.isPending,
        isGrading: gradeEssayMutation.isPending
    };
}; 