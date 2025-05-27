import { ExamStatus } from '../types/exam';
import { sampleQuestions } from './sampleQuestions';

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: typeof sampleQuestions[0][];
  status: ExamStatus;
  createdAt: string;
}

export const sampleExams: Exam[] = [
  {
    id: 1,
    title: "Đề thi cuối kỳ IoT - Lần 1",
    description: "Đề thi đánh giá kiến thức về IoT, giao thức và ứng dụng",
    duration: 90,
    questions: [
      // Câu hỏi trắc nghiệm
      sampleQuestions[0], // IoT là gì
      sampleQuestions[1], // Giao thức IoT
      sampleQuestions[4], // MQTT QoS
      // Câu hỏi tự luận
      sampleQuestions[7], // Kiến trúc 3 tầng
      sampleQuestions[8], // So sánh MQTT và CoAP
    ],
    status: ExamStatus.PUBLISHED,
    createdAt: "2024-03-20T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ IoT - Lần 1",
    description: "Kiểm tra kiến thức cơ bản về IoT và các thành phần",
    duration: 60,
    questions: [
      // Câu hỏi trắc nghiệm
      sampleQuestions[2], // Cảm biến nhiệt độ
      sampleQuestions[3], // Board mạch IoT
      // Câu hỏi tự luận
      sampleQuestions[9], // Hệ thống nhà kính thông minh
    ],
    status: ExamStatus.DRAFT,
    createdAt: "2024-03-19T15:30:00.000Z"
  }
]; 