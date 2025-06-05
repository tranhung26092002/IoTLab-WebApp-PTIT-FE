export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY'
}

export enum ExamStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED'
}

// exam
export interface Exam {
  id: number;
  title: string;
  description: string;
  questions: ExamQuestion[];
  createdAt: number[];
  updatedAt: number[];
}

export interface ExamQuestion {
  id: number;
  question: Question;
  order: number;
}

export interface ExamDTO {
  title: string;
  description: string;
}

// export interface ExamQuestionDTO {
//   id: number;
//   question: QuestionDTO;
//   order: number;
// }

// question

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  options: MultipleChoiceOption[];
  score: number;
  createdAt: number[];
  updatedAt: number[];
}

export interface MultipleChoiceOption {
  id: number;
  question: Question;
  option: string;
  content: string;
  correct: boolean;
}

// export interface QuestionDTO {
//   id: number;
//   type: QuestionType;
//   content: string;
//   options: MultipleChoiceOptionDTO[];
//   score: number;
// }

// export interface MultipleChoiceOptionDTO {
//   id: number;
//   option: string;
//   content: string;
//   isCorrect: boolean;
// }

// student answer
export interface StudentExam {
  id: number;
  student: Student;
  exam: Exam;
  startTime: number[];
  endTime: number[];
  status: ExamStatus;
  score: number;
  answers: StudentAnswerDTO[];
}

export interface Student {
  id: number;
  name: string;
  studentCode: string;
}


export interface StudentAnswer {
  id: number;
  studentExam: StudentExam;
  question: Question;
  selectedOption: string;
  essayAnswer: string;
  imageUrls: string[];
  score: number;
  createdAt: number[];
  updatedAt: number[];
}

export interface StudentAnswerListDTO {
  answers: StudentAnswerDTO[];
}

export interface StudentAnswerDTO {
  questionId: number;
  questionType: QuestionType;
  selectedOption: string;
  essayAnswer: string;
  imageUrls: string[];
  score: number;
}

export interface StudentExamResult {
  id: number;
  studentCode: string;
  score: number;
  correctAnswers: number;
}
