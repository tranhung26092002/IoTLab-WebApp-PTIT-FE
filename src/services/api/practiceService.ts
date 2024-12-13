import api from '../axios';
import { Practice, PracticeFile, PracticeVideo, PracticeGuide } from '../../types/practice';
import { PageResponse } from '../../types/PageResponse';

export const practiceService = {
    // Basic CRUD operations
    getPractices: (page = 0, size = 10) =>
        api.get<PageResponse<Practice>>('/practice/practices', {
            params: { page, size }
        }),

    getAllPractices: (page = 0, size = 10) =>
        api.get<PageResponse<Practice>>('/practice/practices/all', {
            params: { page, size }
        }),

    getPractice: (id: number) =>
        api.get<Practice>(`/practice/practices/${id}`),

    createPractice: (practice: Partial<Practice>, file?: File) => {
        const formData = new FormData();
        if (practice) formData.append('practice', JSON.stringify(practice));
        if (file) formData.append('file', file);

        return api.post<Practice>('/practice/practices', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updatePractice: (id: number, practice: Partial<Practice>, file?: File) => {
        const formData = new FormData();
        if (practice) formData.append('practice', JSON.stringify(practice));
        if (file) formData.append('file', file);

        return api.put<Practice>(`/practice/practices/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deletePractice: (id: number) =>
        api.delete(`/practice/practices/${id}`),

    // Video management
    addVideo: (practiceId: number, formData: FormData) => {
        return api.post<PracticeVideo>(`/practice/practices/${practiceId}/videos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteVideo: (videoId: number) =>
        api.delete(`/practice/practices/videos/${videoId}`),

    // File management
    addFile: (practiceId: number, formData: FormData) => {
        return api.post<PracticeFile>(`/practice/practices/${practiceId}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteFile: (fileId: number) =>
        api.delete(`/practice/practices/files/${fileId}`),

    // Guide management
    addGuide: (practiceId: number, guide: PracticeGuide) =>
        api.post<PracticeGuide>(`/practice/practices/${practiceId}/guides`, guide),

    updateGuide: (guideId: number, guide: PracticeGuide) =>
        api.put<PracticeGuide>(`/practice/practices/guides/${guideId}`, guide),

    deleteGuide: (guideId: number) =>
        api.delete(`/practice/practices/guides/${guideId}`)
};