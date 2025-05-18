import { QuestionType, QuestionDifficulty } from '../types/exam';

export interface Question {
  id: number;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  category: string;
  options?: string[];
  correctOption?: number;
  points: number;
}

export const sampleQuestions: Question[] = [
  // Câu hỏi trắc nghiệm
  {
    id: 1,
    content: "IoT là viết tắt của cụm từ nào?",
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: QuestionDifficulty.EASY,
    category: "IoT Cơ bản",
    options: [
      "Internet of Things",
      "Internet of Technology",
      "Internet of Tools",
      "Internet of Types"
    ],
    correctOption: 0,
    points: 1
  },
  {
    id: 2,
    content: "Giao thức nào sau đây KHÔNG phổ biến trong IoT?",
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: QuestionDifficulty.MEDIUM,
    category: "Giao thức IoT",
    options: [
      "MQTT",
      "CoAP",
      "HTTP",
      "FTP"
    ],
    correctOption: 3,
    points: 2
  },
  {
    id: 3,
    content: "Cảm biến nào thường được sử dụng để đo nhiệt độ trong các ứng dụng IoT?",
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: QuestionDifficulty.MEDIUM,
    category: "Cảm biến IoT",
    options: [
      "DHT11",
      "HC-SR04",
      "PIR",
      "BMP180"
    ],
    correctOption: 0,
    points: 2
  },
  {
    id: 4,
    content: "Board mạch nào sau đây thường được sử dụng trong các dự án IoT?",
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: QuestionDifficulty.EASY,
    category: "Phần cứng IoT",
    options: [
      "Arduino",
      "Raspberry Pi",
      "ESP8266",
      "Tất cả các đáp án trên"
    ],
    correctOption: 3,
    points: 1
  },
  {
    id: 5,
    content: "Trong MQTT, QoS (Quality of Service) có mấy mức?",
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: QuestionDifficulty.HARD,
    category: "Giao thức IoT",
    options: [
      "2",
      "3",
      "4",
      "5"
    ],
    correctOption: 1,
    points: 3
  },
  {
    id: 6,
    content: "Công nghệ không dây nào có mức tiêu thụ năng lượng thấp nhất?",
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: QuestionDifficulty.MEDIUM,
    category: "Kết nối IoT",
    options: [
      "Wi-Fi",
      "Bluetooth",
      "BLE (Bluetooth Low Energy)",
      "ZigBee"
    ],
    correctOption: 2,
    points: 2
  },

  // Câu hỏi tự luận
  {
    id: 7,
    content: "Hãy giải thích kiến trúc 3 tầng phổ biến trong IoT và vai trò của từng tầng.",
    type: QuestionType.ESSAY,
    difficulty: QuestionDifficulty.MEDIUM,
    category: "Kiến trúc IoT",
    points: 5
  },
  {
    id: 8,
    content: "So sánh ưu và nhược điểm của giao thức MQTT và CoAP trong các ứng dụng IoT.",
    type: QuestionType.ESSAY,
    difficulty: QuestionDifficulty.HARD,
    category: "Giao thức IoT",
    points: 5
  },
  {
    id: 9,
    content: "Phân tích các thách thức về bảo mật trong IoT và đề xuất giải pháp.",
    type: QuestionType.ESSAY,
    difficulty: QuestionDifficulty.HARD,
    category: "Bảo mật IoT",
    points: 5
  },
  {
    id: 10,
    content: "Mô tả quy trình thiết kế và triển khai một hệ thống IoT để giám sát nhiệt độ và độ ẩm trong nhà kính thông minh.",
    type: QuestionType.ESSAY,
    difficulty: QuestionDifficulty.MEDIUM,
    category: "Ứng dụng IoT",
    points: 4
  },
  {
    id: 11,
    content: "Giải thích cách thức hoạt động của Edge Computing trong IoT và lợi ích của nó.",
    type: QuestionType.ESSAY,
    difficulty: QuestionDifficulty.HARD,
    category: "Kiến trúc IoT",
    points: 5
  },
  {
    id: 12,
    content: "Phân tích vai trò của AI và Machine Learning trong các ứng dụng IoT.",
    type: QuestionType.ESSAY,
    difficulty: QuestionDifficulty.HARD,
    category: "IoT Nâng cao",
    points: 5
  }
]; 