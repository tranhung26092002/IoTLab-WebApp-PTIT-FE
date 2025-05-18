import { BaseEntity } from './baseEntity';

export enum ExamStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export enum QuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    ESSAY = 'ESSAY'
}

export enum QuestionDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

export interface Question extends BaseEntity {
    id: number;
    content: string;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    category: string;
    options?: string[]; // For multiple choice questions
    correctOption?: number; // For multiple choice questions
    points: number;
}

export interface ExamTemplate extends BaseEntity {
    id: number;
    title: string;
    description: string;
    duration: number; // in minutes
    multipleChoiceCount: number;
    essayCount: number;
    difficultyDistribution: {
        [QuestionDifficulty.EASY]: number;
        [QuestionDifficulty.MEDIUM]: number;
        [QuestionDifficulty.HARD]: number;
    };
    categories: string[];
    status: ExamStatus;
}

export interface Exam extends BaseEntity {
    id: number;
    templateId: number;
    title: string;
    description: string;
    duration: number; // in minutes
    startTime: string;
    endTime: string;
    questions: Question[];
    status: ExamStatus;
}

export interface StudentExam extends BaseEntity {
    id: number;
    examId: number;
    studentId: number;
    startTime: string;
    endTime?: string;
    multipleChoiceAnswers: {
        [questionId: number]: number;
    };
    essayAnswers: {
        [questionId: number]: {
            answer: string;
            images: string[];
        };
    };
    status: ExamStatus;
    score?: number;
}

export interface ExamFilter {
    id?: number;
    title?: string;
    status?: ExamStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface QuestionFilter {
    id?: number;
    type?: QuestionType;
    difficulty?: QuestionDifficulty;
    category?: string;
    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
} 