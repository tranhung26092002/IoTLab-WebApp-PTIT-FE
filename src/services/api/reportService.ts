import api from '../axios';
import { PageResponse } from '../../types/PageResponse';
import { ReportData } from '../../types/report';

export const ReportService = {
  // Get list of reports with pagination
  getReports: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<ReportData>>('/practice/reports', {
      params: { page, size }
    });
    return response.data;
  },

  // Get all reports by user ID
  getReportsByStudentId: async (studentId: number, page = 0, size = 10) => {
    const response = await api.get<PageResponse<ReportData>>(`/practice/reports/student/${studentId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get single report by ID
  getReport: async (id: number) => {
    const response = await api.get<ReportData>(`/practice/reports/${id}`);
    return response.data;
  },

  // Submit new report
  submitReport: async (reportData: ReportData) => {
    const response = await api.post<ReportData>('/practice/reports', reportData);
    return response.data;
  },

  // Upload image for practice content
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/practice/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Save report as draft
  saveAsDraft: async (reportData: ReportData) => {
    const response = await api.post<ReportData>('/practice/reports/draft', reportData);
    return response.data;
  },

  // Update existing report
  updateReport: async (id: number, reportData: Partial<ReportData>) => {
    const response = await api.put<ReportData>(`/practice/reports/${id}`, reportData);
    return response.data;
  },

  // Change report status
  changeReportStatus: async (id: number, status: string) => {
    const response = await api.patch(`/practice/reports/${id}/status?status=${status}`);
    return response.data;
  },

  changeEvaluation: async (contentId: number, evaluation: number) => {
    const response = await api.patch(`/practice/reports/${contentId}/evaluation?evaluation=${evaluation}`);
    return response.data;
  },

  // Delete report
  deleteReport: async (id: number) => {
    await api.delete(`/practice/reports/${id}`);
  }
};