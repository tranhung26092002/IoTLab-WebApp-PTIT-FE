import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/PageResponse';
import { ReportData } from '../types/report';
import { ReportService } from '../services/api/reportService';
import { useUsers } from './useUsers';

export const useReport = (options?: {
    enableReports?: boolean;
    enableStudentReports?: boolean;
}) => {
    const {
        enableReports = false,
        enableStudentReports = false
    } = options || {};
    
    const queryClient = useQueryClient();
    const { me } = useUsers({ enableMe: true });

    // Query for fetching all reports
    const { data: reports, isLoading } = useQuery<PageResponse<ReportData>, AxiosError<ApiError>>({
        queryKey: ['reports'],
        queryFn: async () => {
            const response = await ReportService.getReports();
            return response.data;
        },
        enabled: enableReports,
    });

    // Query for fetching reports by student ID
    const { data: studentReports, isLoading: isLoadingStudentReports } = useQuery<PageResponse<ReportData>, AxiosError<ApiError>>({
        queryKey: ['reports', 'student', me?.id],
        queryFn: async () => {
            const response = await ReportService.getReportsByStudentId(me?.id || 0);
            return response.data;
        },
        enabled: enableStudentReports && Boolean(me?.id),
    });

    // Mutation for getting a single report
    const getReportMutation = useMutation<ReportData, AxiosError<ApiError>, number>({
        mutationFn: (id) => ReportService.getReport(id),
        onError: handleApiError
    });

    // Mutation for submitting a new report
    const submitReportMutation = useMutation<ReportData, AxiosError<ApiError>, ReportData>({
        mutationFn: (reportData) => ReportService.submitReport(reportData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleSuccess('SUBMIT_REPORT');
        },
        onError: handleApiError
    });

    // Mutation for saving report as draft
    const saveAsDraftMutation = useMutation<ReportData, AxiosError<ApiError>, ReportData>({
        mutationFn: (reportData) => ReportService.saveAsDraft(reportData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleSuccess('SAVE_DRAFT');
        },
        onError: handleApiError
    });

    // Mutation for updating an existing report
    const updateReportMutation = useMutation<ReportData, AxiosError<ApiError>, { id: number; reportData: Partial<ReportData> }>({
        mutationFn: ({ id, reportData }) => ReportService.updateReport(id, reportData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleSuccess('UPDATE_REPORT');
        },
        onError: handleApiError
    });


    // Mutation for changing report status
    const changeReportStatusMutation = useMutation({
        mutationFn: ({ id, status }: {id: number, status: string}) => 
            ReportService.changeReportStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleSuccess('CHANGE_STATUS');
        },
        onError: handleApiError
    });

    
    const changeEvaluation = useMutation({
        mutationFn: ({ contentId, evaluation }: { contentId: number; evaluation: number }) =>
            ReportService.changeEvaluation(contentId, evaluation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleSuccess('CHANGE_EVALUATION');
        },
    });

    // Mutation for deleting a report
    const deleteReportMutation = useMutation<void, AxiosError<ApiError>, number>({
        mutationFn: (id) => ReportService.deleteReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleSuccess('DELETE_REPORT');
        },
        onError: handleApiError
    });

    // Mutation for uploading an image
    const uploadImageMutation = useMutation<string, AxiosError<ApiError>, File>({
        mutationFn: async (file) => {
            const response = await ReportService.uploadImage(file);
            return response.url;
        },
        onError: handleApiError
    });

    return {
        // Data
        reports,
        studentReports,

        // Methods
        getReport: getReportMutation.mutateAsync,
        submitReport: submitReportMutation.mutateAsync,
        saveAsDraft: saveAsDraftMutation.mutateAsync,
        updateReport: updateReportMutation.mutateAsync,
        deleteReport: deleteReportMutation.mutateAsync,
        uploadImage: uploadImageMutation.mutateAsync,
        changeReportStatus: changeReportStatusMutation.mutateAsync,
        changeEvaluation: changeEvaluation.mutateAsync,

        // Loading states
        isLoading,
        isLoadingStudentReports,
        isSubmitting: submitReportMutation.isPending,
        isSaving: saveAsDraftMutation.isPending,
        isUpdating: updateReportMutation.isPending,
        isDeleting: deleteReportMutation.isPending,
        isUploading: uploadImageMutation.isPending,
        isChangingStatus: changeReportStatusMutation.isPending,
        isUpdatingEvaluation: changeEvaluation.isPending,

        // Errors
        getReportError: getReportMutation.error,
        submitReportError: submitReportMutation.error,
        saveAsDraftError: saveAsDraftMutation.error,
        updateReportError: updateReportMutation.error,
        deleteReportError: deleteReportMutation.error,
        uploadImageError: uploadImageMutation.error,
        changeReportStatusError: changeReportStatusMutation.error,
        changeEvaluationError: changeEvaluation.error
    };
};