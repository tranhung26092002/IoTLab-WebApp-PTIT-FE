import api from '../axios';
import { StudentProgress } from '../../types';

const BASE_URL = '/practice/progress';

export const studentProgressService = {
    // Lấy danh sách tiến trình thực hành của một sinh viên
    getStudentProgress: async (studentId: number): Promise<StudentProgress[]> => {
        const response = await api.get<StudentProgress[]>(`${BASE_URL}/student/${studentId}`);
        return response.data;
    },

    // Lấy tiến trình thực hành của một sinh viên cho một bài thực hành cụ thể
    getPracticeProgress: async (studentId: number, practiceId: number): Promise<StudentProgress> => {
        const response = await api.get<StudentProgress>(`${BASE_URL}/student/${studentId}/practice/${practiceId}`);
        return response.data;
    },

    // Bắt đầu một bài thực hành
    startPractice: async (studentId: number, practiceId: number): Promise<StudentProgress> => {
        const response = await api.post<StudentProgress>(
            `${BASE_URL}/student/${studentId}/practice/${practiceId}/start`
        );
        return response.data;
    },

    // Hoàn thành một bài thực hành
    completePractice: async (
        studentId: number,
        practiceId: number,
        score?: number,
        comment?: string
    ): Promise<StudentProgress> => {
        const response = await api.post<StudentProgress>(
            `${BASE_URL}/student/${studentId}/practice/${practiceId}/complete`,
            null,
            {
                params: {
                    score,
                    comment
                }
            }
        );
        return response.data;
    },

    // Cập nhật điểm cho bài thực hành
    updatePracticeScore: async (
        studentId: number,
        practiceId: number,
        score: number,
        comment?: string
    ): Promise<StudentProgress> => {
        const response = await api.put<StudentProgress>(
            `${BASE_URL}/student/${studentId}/practice/${practiceId}/score`,
            null,
            {
                params: {
                    score,
                    comment
                }
            }
        );
        return response.data;
    },

    // Kiểm tra xem sinh viên có thể bắt đầu bài thực hành không
    canStartPractice: async (studentId: number, practiceId: number): Promise<boolean> => {
        const response = await api.get<boolean>(
            `${BASE_URL}/student/${studentId}/practice/${practiceId}/can-start`
        );
        return response.data;
    },

    // Kiểm tra xem sinh viên đã hoàn thành tất cả bài thực hành chưa
    hasCompletedAllPractices: async (studentId: number): Promise<boolean> => {
        const response = await api.get<boolean>(
            `${BASE_URL}/student/${studentId}/completed-all`
        );
        return response.data;
    },

    // Lấy tỷ lệ hoàn thành của sinh viên
    getCompletionRate: async (studentId: number): Promise<number> => {
        const response = await api.get<number>(
            `${BASE_URL}/student/${studentId}/completion-rate`
        );
        return response.data;
    }
}; 