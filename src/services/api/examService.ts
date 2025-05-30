import api from '../axios';
import { Exam } from '../../types/exam';
import { PageResponse } from '../../types/PageResponse';

export const examService = {
    // Basic Exam CRUD operations
    getExams: () =>
        api.get<PageResponse<Exam>>('/exams'),

    getRandomExam: () =>
        api.get<Exam>('/exams/random'),

    getExam: (id: number) =>
        api.get<Exam>(`/exams/${id}`),

    createExam: (exam: Partial<Exam>) =>
        api.post<Exam>('/exams', exam),

    updateExam: (id: number, exam: Partial<Exam>) =>
        api.put<Exam>(`/exams/${id}`, exam),

    deleteExam: (id: number) =>
        api.delete(`/exams/${id}`),
}; 