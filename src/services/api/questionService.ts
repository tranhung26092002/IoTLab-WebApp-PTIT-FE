import api from '../axios';
import { Question } from '../../types/exam';
import { PageResponse } from '../../types/PageResponse';

export const questionService = {
    // Basic CRUD operations
    getQuestions: (params: { page: number; size: number }) =>
        api.get<PageResponse<Question>>('/practice/questions', { params }),

    getQuestion: (id: number) =>
        api.get<Question>(`/practice/questions/${id}`),

    // Question creation
    createMultipleChoiceQuestion: (question: Partial<Question>) =>
        api.post<Question>('/practice/questions/multiple-choice', question),

    createEssayQuestion: (question: Partial<Question>) =>
        api.post<Question>('/practice/questions/essay', question),

    // Question update and delete
    updateQuestion: (id: number, question: Partial<Question>) =>
        api.put<Question>(`/practice/questions/${id}`, question),

    deleteQuestion: (id: number) =>
        api.delete(`/practice/questions/${id}`),

    // Import questions from Excel
    importQuestionsFromExcel: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return api.post<string>('/practice/questions/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
}; 