import api from '../axios';
import { 
    StudentExam, 
    StudentAnswer, 
    StartExamDTO, 
    StudentAnswerDTO, 
    StudentAnswerListDTO,
    StudentExamResult,
    ExamStatus
} from '../../types/exam';
import { PageResponse } from '../../types/PageResponse';

export const studentExamService = {
    // Basic CRUD operations
    getStudentExams: () =>
        api.get<PageResponse<StudentExam>>('/student-exams'),

    getStudentExam: (id: number) =>
        api.get<StudentExam>(`/student-exams/${id}`),

    // Filter operations
    getStudentExamsByStudentId: (studentId: number) =>
        api.get<PageResponse<StudentExam>>(`/student-exams/student/${studentId}`),

    getStudentExamsByExamId: (examId: number) =>
        api.get<PageResponse<StudentExam>>(`/student-exams/exam/${examId}`),

    getStudentExamsByStatus: (status: ExamStatus) =>
        api.get<PageResponse<StudentExam>>(`/student-exams/status/${status}`),

    // Exam taking operations
    startExam: (startExamDTO: StartExamDTO) =>
        api.post<StudentExam>('/student-exams', startExamDTO),

    submitExam: (id: number) =>
        api.post<void>(`/student-exams/${id}/submit`),

    // Answer operations
    getStudentAnswers: (id: number) =>
        api.get<StudentAnswer[]>(`/student-exams/${id}/answers`),

    saveAnswers: (studentExamId: number, answers: StudentAnswerListDTO, images?: File[]) => {
        const formData = new FormData();
        formData.append('answers', JSON.stringify(answers));
        if (images) {
            images.forEach((image, index) => {
                formData.append(`images`, image);
            });
        }

        return api.post<StudentAnswer[]>(`/student-exams/${studentExamId}/answers`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Grading operations
    gradeEssayAnswer: (answerId: number, score: number) =>
        api.post<void>(`/student-exams/answers/${answerId}/grade`, null, {
            params: { score }
        }),

    // Results and details
    getStudentExamResult: (id: number) =>
        api.get<StudentExamResult>(`/student-exams/${id}/result`),

    getCompletedExamsByStudentId: (studentId: number) =>
        api.get<PageResponse<StudentExam>>(`/student-exams/student/${studentId}/completed`),

    getStudentExamDetails: (id: number) =>
        api.get<StudentExam>(`/student-exams/${id}/details`),

    // Status management
    updateExamStatus: (id: number, status: ExamStatus) =>
        api.patch<StudentExam>(`/student-exams/${id}/status`, null, {
            params: { status }
        }),

    // Statistics
    getExamStatistics: (examId: number) =>
        api.get<Record<string, any>>(`/student-exams/exam/${examId}/statistics`),

    getStudentStatistics: (studentId: number) =>
        api.get<Record<string, any>>(`/student-exams/student/${studentId}/statistics`),

    getTopPerformers: (examId: number, limit: number = 10) =>
        api.get<StudentExamResult[]>(`/student-exams/exam/${examId}/top-performers`, {
            params: { limit }
        }),

    getPassingRate: (examId: number, passingScore: number = 5.0) =>
        api.get<number>(`/student-exams/exam/${examId}/passing-rate`, {
            params: { passingScore }
        })
}; 