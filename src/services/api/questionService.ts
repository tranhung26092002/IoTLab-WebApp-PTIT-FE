import api from '../axios';
import { Question, QuestionType } from '../../types/exam';
import { PageResponse } from '../../types/PageResponse';

export const questionService = {
    // Basic CRUD operations
    getQuestions: () =>
        api.get<PageResponse<Question>>('/questions'),

    getQuestion: (id: number) =>
        api.get<Question>(`/questions/${id}`),

    getQuestionsByType: (type: QuestionType) =>
        api.get<PageResponse<Question>>(`/questions/type/${type}`),

    // Question creation
    createMultipleChoiceQuestion: (question: Partial<Question>) =>
        api.post<Question>('/questions/multiple-choice', question),

    createEssayQuestion: (question: Partial<Question>) =>
        api.post<Question>('/questions/essay', question),

    // Question update and delete
    updateQuestion: (id: number, question: Partial<Question>) =>
        api.put<Question>(`/questions/${id}`, question),

    deleteQuestion: (id: number) =>
        api.delete(`/questions/${id}`),

    // Import questions from Excel
    importQuestionsFromExcel: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return api.post<string>('/questions/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
}; 