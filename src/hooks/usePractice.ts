import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { practiceService } from '../services/api/practiceService';
import { Practice, PracticeGuide, PageResponse, PracticeVideo, PracticeFile } from '../types/practice';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';

export const usePractice = (page = 0, size = 10) => {
    const queryClient = useQueryClient();

    const { data: practices, isLoading } = useQuery<PageResponse<Practice>, AxiosError<ApiError>>({
        queryKey: ['practices', page, size],
        queryFn: async () => {
            const response = await practiceService.getPractices(page, size);
            return response.data;
        }
    });

    const { data: allPractices, isLoading: isLoadingAll } = useQuery<PageResponse<Practice>, AxiosError<ApiError>>({
        queryKey: ['allPractices', page, size],
        queryFn: async () => {
            const response = await practiceService.getAllPractices(page, size);
            return response.data;
        }
    });

    const getPracticeMutation = useMutation<Practice, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            const response = await practiceService.getPractice(id);
            return response.data;
        },
        onError: handleApiError
    });

    const createPracticeMutation = useMutation<Practice, AxiosError<ApiError>, { practice: Partial<Practice>; file?: File }>({
        mutationFn: async ({ practice, file }) => {
            const response = await practiceService.createPractice(practice, file);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('CREATE_PRACTICE');
        },
        onError: handleApiError
    });

    const updatePracticeMutation = useMutation<Practice, AxiosError<ApiError>, { id: number; practice: Partial<Practice>; file?: File }>({
        mutationFn: async ({ id, practice, file }) => {
            const response = await practiceService.updatePractice(id, practice, file);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('UPDATE_PRACTICE');
        },
        onError: handleApiError
    });

    const deletePracticeMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: async (id) => {
            await practiceService.deletePractice(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('DELETE_PRACTICE');
        },
        onError: handleApiError
    });

    const addVideoMutation = useMutation<PracticeVideo, AxiosError<ApiError>, { practiceId: number; formData: FormData }>({
        mutationFn: async ({ practiceId, formData }) => {
            const response = await practiceService.addVideo(practiceId, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('ADD_VIDEO');
        },
        onError: handleApiError
    });

    const deleteVideoMutation = useMutation<void, AxiosError<ApiError>, { videoId: number }>({
        mutationFn: async ({ videoId }) => {
            await practiceService.deleteVideo(videoId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('DELETE_VIDEO');
        },
        onError: handleApiError
    });

    const addFileMutation = useMutation<PracticeFile, AxiosError<ApiError>, { practiceId: number; formData: FormData }>({
        mutationFn: async ({ practiceId, formData }) => {
            const response = await practiceService.addFile(practiceId, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('ADD_FILE');
        },
        onError: handleApiError
    });

    const deleteFileMutation = useMutation<void, AxiosError<ApiError>, { fileId: number }>({
        mutationFn: async ({ fileId }) => {
            await practiceService.deleteFile(fileId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('DELETE_FILE');
        },
        onError: handleApiError
    });

    const addGuideMutation = useMutation<PracticeGuide, AxiosError<ApiError>, { practiceId: number; guide: PracticeGuide }>({
        mutationFn: async ({ practiceId, guide }) => {
            const response = await practiceService.addGuide(practiceId, guide);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('ADD_GUIDE');
        },
        onError: handleApiError
    });

    const updateGuideMutation = useMutation<PracticeGuide, AxiosError<ApiError>, { guideId: number; guide: PracticeGuide }>({
        mutationFn: async ({ guideId, guide }) => {
            const response = await practiceService.updateGuide(guideId, guide);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('UPDATE_GUIDE');
        },
        onError: handleApiError
    });

    const deleteGuideMutation = useMutation<void, AxiosError<ApiError>, { guideId: number }>({
        mutationFn: async ({ guideId }) => {
            await practiceService.deleteGuide(guideId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
            handleSuccess('DELETE_GUIDE');
        },
        onError: handleApiError
    });

    return {
        // Data
        practices,
        allPractices,

        // Methods
        getPractice: getPracticeMutation.mutateAsync,
        createPractice: createPracticeMutation.mutateAsync,
        updatePractice: updatePracticeMutation.mutateAsync,
        deletePractice: deletePracticeMutation.mutateAsync,
        addVideo: addVideoMutation.mutateAsync,
        deleteVideo: deleteVideoMutation.mutateAsync,
        addFile: addFileMutation.mutateAsync,
        deleteFile: deleteFileMutation.mutateAsync,
        addGuide: addGuideMutation.mutateAsync,
        updateGuide: updateGuideMutation.mutate,
        deleteGuide: deleteGuideMutation.mutateAsync,

        // Loading states
        isLoading,
        isLoadingAll,
        isCreating: createPracticeMutation.isPending,
        isUpdating: updatePracticeMutation.isPending,
        isDeleting: deletePracticeMutation.isPending,
        isAddingVideo: addVideoMutation.isPending,
        isDeletingVideo: deleteVideoMutation.isPending,
        isAddingFile: addFileMutation.isPending,
        isDeletingFile: deleteFileMutation.isPending,
        isAddingGuide: addGuideMutation.isPending,
        isUpdatingGuide: updateGuideMutation.isPending,
        isDeletingGuide: deleteGuideMutation.isPending,

        // Errors
        getPracticeError: getPracticeMutation.error,
        createPracticeError: createPracticeMutation.error,
        updatePracticeError: updatePracticeMutation.error,
        deletePracticeError: deletePracticeMutation.error,
        addVideoError: addVideoMutation.error,
        deleteVideoError: deleteVideoMutation.error,
        addFileError: addFileMutation.error,
        deleteFileError: deleteFileMutation.error,
        addGuideError: addGuideMutation.error,
        deleteGuideError: deleteGuideMutation.error
    };
};