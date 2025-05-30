import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentExamService } from '../services/api/studentExamService';
import { 
    StudentExam, 
    StudentAnswer, 
    StartExamDTO, 
    StudentAnswerListDTO,
    StudentExamResult,
    ExamStatus
} from '../types/exam';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/PageResponse';

export const useStudentExam = () => {
    const queryClient = useQueryClient();

    // Get all student exams
    const { data: studentExams, isLoading } = useQuery<PageResponse<StudentExam>, AxiosError<ApiError>>({
        queryKey: ['student-exams'],
        queryFn: async () => {
            const response = await studentExamService.getStudentExams();
            return response.data;
        }
    });

    // Get single student exam
    const getStudentExamMutation = useMutation<StudentExam, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentExam(id);
            return response.data;
        },
        onError: handleApiError
    });

    // Get student exams by student ID
    const useStudentExamsByStudentId = (studentId: number) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<StudentExam>>({
            queryKey: ['student-exams', 'student', studentId],
            queryFn: async () => {
                const response = await studentExamService.getStudentExamsByStudentId(studentId);
                return response.data;
            }
        });

        return {
            studentExams: data?.data || [],
            isLoading,
            refetch
        };
    };

    // Get student exams by exam ID
    const useStudentExamsByExamId = (examId: number) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<StudentExam>>({
            queryKey: ['student-exams', 'exam', examId],
            queryFn: async () => {
                const response = await studentExamService.getStudentExamsByExamId(examId);
                return response.data;
            }
        });

        return {
            studentExams: data?.data || [],
            isLoading,
            refetch
        };
    };

    // Get student exams by status
    const useStudentExamsByStatus = (status: ExamStatus) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<StudentExam>>({
            queryKey: ['student-exams', 'status', status],
            queryFn: async () => {
                const response = await studentExamService.getStudentExamsByStatus(status);
                return response.data;
            }
        });

        return {
            studentExams: data?.data || [],
            isLoading,
            refetch
        };
    };

    // Start exam
    const startExamMutation = useMutation<StudentExam, AxiosError<ApiError>, StartExamDTO>({
        mutationFn: async (startExamDTO) => {
            const response = await studentExamService.startExam(startExamDTO);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student-exams'] });
            handleSuccess('START_EXAM');
        },
        onError: handleApiError
    });

    // Submit exam
    const submitExamMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            await studentExamService.submitExam(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student-exams'] });
            handleSuccess('SUBMIT_EXAM');
        },
        onError: handleApiError
    });

    // Get student answers
    const getStudentAnswersMutation = useMutation<StudentAnswer[], AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentAnswers(id);
            return response.data;
        },
        onError: handleApiError
    });

    // Save answers
    const saveAnswersMutation = useMutation<StudentAnswer[], AxiosError<ApiError>, { 
        studentExamId: number; 
        answers: StudentAnswerListDTO; 
        images?: File[] 
    }>({
        mutationFn: async ({ studentExamId, answers, images }) => {
            const response = await studentExamService.saveAnswers(studentExamId, answers, images);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student-exams'] });
            handleSuccess('SAVE_ANSWERS');
        },
        onError: handleApiError
    });

    // Grade essay answer
    const gradeEssayAnswerMutation = useMutation<void, AxiosError<ApiError>, { answerId: number; score: number }>({
        mutationFn: async ({ answerId, score }) => {
            await studentExamService.gradeEssayAnswer(answerId, score);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student-exams'] });
            handleSuccess('GRADE_ESSAY');
        },
        onError: handleApiError
    });

    // Get student exam result
    const getStudentExamResultMutation = useMutation<StudentExamResult, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentExamResult(id);
            return response.data;
        },
        onError: handleApiError
    });

    // Get completed exams by student ID
    const useCompletedExamsByStudentId = (studentId: number) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<StudentExam>>({
            queryKey: ['student-exams', 'student', studentId, 'completed'],
            queryFn: async () => {
                const response = await studentExamService.getCompletedExamsByStudentId(studentId);
                return response.data;
            }
        });

        return {
            completedExams: data?.data || [],
            isLoading,
            refetch
        };
    };

    // Get student exam details
    const getStudentExamDetailsMutation = useMutation<StudentExam, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await studentExamService.getStudentExamDetails(id);
            return response.data;
        },
        onError: handleApiError
    });

    // Update exam status
    const updateExamStatusMutation = useMutation<StudentExam, AxiosError<ApiError>, { id: number; status: ExamStatus }>({
        mutationFn: async ({ id, status }) => {
            const response = await studentExamService.updateExamStatus(id, status);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student-exams'] });
            handleSuccess('UPDATE_EXAM_STATUS');
        },
        onError: handleApiError
    });

    // Get exam statistics
    const getExamStatisticsMutation = useMutation<Record<string, any>, AxiosError<ApiError>, number>({
        mutationFn: async (examId) => {
            const response = await studentExamService.getExamStatistics(examId);
            return response.data;
        },
        onError: handleApiError
    });

    // Get student statistics
    const getStudentStatisticsMutation = useMutation<Record<string, any>, AxiosError<ApiError>, number>({
        mutationFn: async (studentId) => {
            const response = await studentExamService.getStudentStatistics(studentId);
            return response.data;
        },
        onError: handleApiError
    });

    // Get top performers
    const getTopPerformersMutation = useMutation<StudentExamResult[], AxiosError<ApiError>, { examId: number; limit?: number }>({
        mutationFn: async ({ examId, limit }) => {
            const response = await studentExamService.getTopPerformers(examId, limit);
            return response.data;
        },
        onError: handleApiError
    });

    // Get passing rate
    const getPassingRateMutation = useMutation<number, AxiosError<ApiError>, { examId: number; passingScore?: number }>({
        mutationFn: async ({ examId, passingScore }) => {
            const response = await studentExamService.getPassingRate(examId, passingScore);
            return response.data;
        },
        onError: handleApiError
    });

    return {
        // Data
        studentExams,
        useStudentExamsByStudentId,
        useStudentExamsByExamId,
        useStudentExamsByStatus,
        useCompletedExamsByStudentId,

        // Methods
        getStudentExam: getStudentExamMutation.mutateAsync,
        startExam: startExamMutation.mutateAsync,
        submitExam: submitExamMutation.mutateAsync,
        getStudentAnswers: getStudentAnswersMutation.mutateAsync,
        saveAnswers: saveAnswersMutation.mutateAsync,
        gradeEssayAnswer: gradeEssayAnswerMutation.mutateAsync,
        getStudentExamResult: getStudentExamResultMutation.mutateAsync,
        getStudentExamDetails: getStudentExamDetailsMutation.mutateAsync,
        updateExamStatus: updateExamStatusMutation.mutateAsync,
        getExamStatistics: getExamStatisticsMutation.mutateAsync,
        getStudentStatistics: getStudentStatisticsMutation.mutateAsync,
        getTopPerformers: getTopPerformersMutation.mutateAsync,
        getPassingRate: getPassingRateMutation.mutateAsync,

        // Loading states
        isLoading,
        isGettingStudentExam: getStudentExamMutation.isPending,
        isStarting: startExamMutation.isPending,
        isSubmitting: submitExamMutation.isPending,
        isGettingAnswers: getStudentAnswersMutation.isPending,
        isSavingAnswers: saveAnswersMutation.isPending,
        isGrading: gradeEssayAnswerMutation.isPending,
        isGettingResult: getStudentExamResultMutation.isPending,
        isGettingDetails: getStudentExamDetailsMutation.isPending,
        isUpdatingStatus: updateExamStatusMutation.isPending,
        isGettingStatistics: getExamStatisticsMutation.isPending,
        isGettingStudentStatistics: getStudentStatisticsMutation.isPending,
        isGettingTopPerformers: getTopPerformersMutation.isPending,
        isGettingPassingRate: getPassingRateMutation.isPending,

        // Errors
        getStudentExamError: getStudentExamMutation.error,
        startExamError: startExamMutation.error,
        submitExamError: submitExamMutation.error,
        getStudentAnswersError: getStudentAnswersMutation.error,
        saveAnswersError: saveAnswersMutation.error,
        gradeEssayAnswerError: gradeEssayAnswerMutation.error,
        getStudentExamResultError: getStudentExamResultMutation.error,
        getStudentExamDetailsError: getStudentExamDetailsMutation.error,
        updateExamStatusError: updateExamStatusMutation.error,
        getExamStatisticsError: getExamStatisticsMutation.error,
        getStudentStatisticsError: getStudentStatisticsMutation.error,
        getTopPerformersError: getTopPerformersMutation.error,
        getPassingRateError: getPassingRateMutation.error
    };
}; 