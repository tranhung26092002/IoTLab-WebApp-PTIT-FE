import api from '../axios';
import { Exam } from '../../types/exam';
import { ExamDTO } from '../../types/exam';

export const examService = {
    // Get all exams
    getExams: () =>
        api.get<Exam[]>('/practice/exams'),

    // Get exam by ID
    getExam: (id: number) =>
        api.get<Exam>(`/practice/exams/${id}`),

    // Get random exam
    getRandomExam: () =>
        api.get<Exam>('/practice/exams/random'),

    // Get random exam and start for student
    getRandomExamAndStart: (studentId: number) =>
        api.get<Exam>(`/practice/exams/random/${studentId}`),

    // Create new exam
    createExam: (exam: ExamDTO) =>
        api.post<Exam>('/practice/exams', {
            title: exam.title,
            description: exam.description
        }),

    // Update existing exam
    updateExam: (id: number, exam: ExamDTO) =>
        api.put<Exam>(`/practice/exams/${id}`, {
            id: id,
            title: exam.title,
            description: exam.description
        }),

    // Delete exam
    deleteExam: (id: number) =>
        api.delete<void>(`/practice/exams/${id}`),
}; 