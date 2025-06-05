import api from '../axios';
import { 
    StudentExam,  
    StudentAnswerListDTO,
    StudentExamResult,
} from '../../types/exam';
import { PageResponse } from '../../types/PageResponse';

interface GetStudentExamsParams {
    page?: number;
    size?: number;
}

export const studentExamService = {
    getAllStudentExams: async ({ page = 0, size = 10 }: GetStudentExamsParams = {}) => {
        const response = await api.get<PageResponse<StudentExam>>('/practice/student-exams', {
            params: { page, size }
        });
        return response;
    },

    getStudentExamById: (id: number) =>
        api.get<StudentExam>(`/practice/student-exams/${id}`),

    getCurrentExam: (studentId: number) =>
        api.get<StudentExam>(`/practice/student-exams/student/${studentId}/current`),

    submitExam: (studentExamId: number, answers: StudentAnswerListDTO, images?: File[]) => {
        const formData = new FormData();
        if (answers) {
            formData.append('answers', JSON.stringify(answers));
        }
        if (images) {
            images.forEach(image => formData.append('images', image));
        }
        return api.post<StudentExamResult>(`/practice/student-exams/${studentExamId}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    gradeEssayAnswer: (answerId: number, score: number) =>
        api.post<StudentExamResult>(`/practice/student-exams/answers/${answerId}/grade`, null, {
            params: { score }
        }),

    getStudentExamResult: (studentExamId: number) =>
        api.get<StudentExamResult>(`/practice/student-exams/${studentExamId}/result`),

    getStudentExamDetails: (studentExamId: number) =>
        api.get<StudentExam>(`/practice/student-exams/${studentExamId}/details`),
}; 