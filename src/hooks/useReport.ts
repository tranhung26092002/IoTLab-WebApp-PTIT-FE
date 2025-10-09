import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '../types/apiError';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { PageResponse } from '../types/pageResponse';
import { ReportData, ReportFilters } from '../types/report';
import { ReportService } from '../services/api/reportService';

export const useReport = (options?: {
    enableReports?: boolean;
    enableStudentReports?: boolean;
}) => {
    const {
        enableReports = false,
    } = options || {};
    
    const queryClient = useQueryClient();

    // Query for fetching all reports
    const getReports = useQuery<PageResponse<ReportData>, AxiosError<ApiError>>({
        queryKey: ['reports'],
        queryFn: async () => {
            const response = await ReportService.getReports();
            return response.data;
        },
        enabled: enableReports,
    });

    const useFilteredReports = (filters: ReportFilters = {}) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<Report>>({
            queryKey: ['reports', 'filter', filters],
            queryFn: () => ReportService.filterReports(
                filters,
                filters.page || 0,
                filters.size || 10
            ),
        });

        return {
            reports: data?.data || [],
            isLoading,
            metadata: data?.metaData,
            handlePageChange: (newPage: number) => {
                filters.page = newPage;
                refetch();
            },
            handleSizeChange: (newSize: number) => {
                filters.size = newSize;
                filters.page = 0;
                refetch();
            }
        };
    };

    const useFilteredReportsOfMe = (filters: ReportFilters = {}) => {
        const { data, isLoading, refetch } = useQuery<PageResponse<Report>>({
            queryKey: ['reportsOfMe', 'filter', filters],
            queryFn: () => ReportService.filterReportsOfMe(
                filters,
                filters.page || 0,
                filters.size || 10
            ),
        });

        return {
            reportsOfMe: data?.data || [],
            isLoading,
            metadata: data?.metaData,
            handlePageChange: (newPage: number) => {
                filters.page = newPage;
                refetch();
            },
            handleSizeChange: (newSize: number) => {
                filters.size = newSize;
                filters.page = 0;
                refetch();
            }
        };
    };

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
        getReports,
        useFilteredReportsOfMe,
        useFilteredReports,

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