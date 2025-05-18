import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sampleExams } from '../data/sampleExams';
import { ExamStatus, QuestionType } from '../types/exam';

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: {
    id: number;
    content: string;
    type: QuestionType;
    options?: string[];
    correctOption?: number;
    points: number;
  }[];
  status: ExamStatus;
  createdAt: string;
}

interface ExamContextType {
  exams: Exam[];
  addExam: (exam: Exam) => void;
  deleteExam: (id: number) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(sampleExams);

  const addExam = (exam: Exam) => {
    setExams([...exams, exam]);
  };

  const deleteExam = (id: number) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  return (
    <ExamContext.Provider value={{ exams, addExam, deleteExam }}>
      {children}
    </ExamContext.Provider>
  );
}; 