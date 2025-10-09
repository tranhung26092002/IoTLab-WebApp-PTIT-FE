import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService } from '../services/api/questionService';
import { Question } from '../types/exam';
import { AxiosError } from 'axios';
import { ApiError } from '../types/apiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/pageResponse';

interface UseQuestionParams {
  page: number;
  size: number;
}

export const useQuestion = ({ page, size }: UseQuestionParams) => {
    const queryClient = useQueryClient();

    const { data: questions, isLoading } = useQuery<PageResponse<Question>, AxiosError<ApiError>>({
        queryKey: ['questions', page, size],
        queryFn: async () => {
            const response = await questionService.getQuestions({ page, size });
            return response.data;
        }
    });

    const getQuestionMutation = useMutation<Question, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await questionService.getQuestion(id);
            return response.data;
        },
        onError: handleApiError
    });

    const createMultipleChoiceQuestionMutation = useMutation<Question, AxiosError<ApiError>, Partial<Question>>({
        mutationFn: async (question) => {
            const response = await questionService.createMultipleChoiceQuestion(question);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            handleSuccess('CREATE_MULTIPLE_CHOICE_QUESTION');
        },
        onError: handleApiError
    });

    const createEssayQuestionMutation = useMutation<Question, AxiosError<ApiError>, Partial<Question>>({
        mutationFn: async (question) => {
            const response = await questionService.createEssayQuestion(question);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            handleSuccess('CREATE_ESSAY_QUESTION');
        },
        onError: handleApiError
    });

    const updateQuestionMutation = useMutation<Question, AxiosError<ApiError>, { id: number; question: Partial<Question> }>({
        mutationFn: async ({ id, question }) => {
            const response = await questionService.updateQuestion(id, question);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            handleSuccess('UPDATE_QUESTION');
        },
        onError: handleApiError
    });

    const deleteQuestionMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            await questionService.deleteQuestion(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            handleSuccess('DELETE_QUESTION');
        },
        onError: handleApiError
    });

    const importQuestionsMutation = useMutation<string, AxiosError<ApiError>, File>({
        mutationFn: async (file) => {
            const response = await questionService.importQuestionsFromExcel(file);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            handleSuccess('IMPORT_QUESTIONS');
        },
        onError: handleApiError
    });

    return {
        // Data
        questions,

        // Methods
        getQuestion: getQuestionMutation.mutateAsync,
        createMultipleChoiceQuestion: createMultipleChoiceQuestionMutation.mutateAsync,
        createEssayQuestion: createEssayQuestionMutation.mutateAsync,
        updateQuestion: updateQuestionMutation.mutateAsync,
        deleteQuestion: deleteQuestionMutation.mutateAsync,
        importQuestions: importQuestionsMutation.mutateAsync,

        // Loading states
        isLoading,
        isCreatingMultipleChoice: createMultipleChoiceQuestionMutation.isPending,
        isCreatingEssay: createEssayQuestionMutation.isPending,
        isUpdating: updateQuestionMutation.isPending,
        isDeleting: deleteQuestionMutation.isPending,
        isImporting: importQuestionsMutation.isPending,

        // Errors
        getQuestionError: getQuestionMutation.error,
        createMultipleChoiceError: createMultipleChoiceQuestionMutation.error,
        createEssayError: createEssayQuestionMutation.error,
        updateQuestionError: updateQuestionMutation.error,
        deleteQuestionError: deleteQuestionMutation.error,
        importQuestionsError: importQuestionsMutation.error
    };
}; 