export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY'
}

export enum ExamStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED'
}

export interface MultipleChoiceOption {
  id: number;
  option: string; // A, B, C, D
  content: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  options?: MultipleChoiceOption[]; // Only for multiple choice questions
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  id: number;
  examId: number;
  question: Question;
  order: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  questions: ExamQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentAnswer {
  id: number;
  studentExamId: number;
  questionId: number;
  essayAnswer?: string;
  selectedOption?: string;
  imageUrls?: string[];
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentExam {
  id: number;
  studentId: number;
  examId: number;
  startTime: string;
  endTime?: string;
  status: ExamStatus;
  score?: number;
  answers: StudentAnswer[];
}

// DTOs for API requests/responses
export interface StartExamDTO {
  studentId: number;
  examId: number;
  startTime?: string;
}

export interface StudentAnswerDTO {
  questionId: number;
  questionType: QuestionType;
  selectedOption?: string;
  essayAnswer?: string;
  imageUrls?: string[];
  score?: number;
}

export interface StudentAnswerListDTO {
  answers: StudentAnswerDTO[];
}

export interface StudentExamResult {
  id: number;
  studentCode: string;
  score: number;
  correctAnswers: number;
} 