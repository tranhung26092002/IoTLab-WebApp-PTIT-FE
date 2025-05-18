import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, message } from 'antd';
import { ExclamationCircleOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ExamStatus, QuestionType } from '../../types/exam';
import { useExam } from '../../contexts/ExamContext';

const { confirm } = Modal;

interface Question {
  id: number;
  content: string;
  type: QuestionType;
  options?: string[];
  correctOption?: number;
  points: number;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  status: ExamStatus;
  createdAt: string;
}

// Dữ liệu mẫu cho đề thi
const sampleExams: Exam[] = [
  {
    id: 1,
    title: "Đề thi cuối kỳ Web Frontend - Lần 1",
    description: "Đề thi đánh giá kiến thức về React, TypeScript và CSS",
    duration: 90,
    questions: [
      {
        id: 1,
        content: "Trong JavaScript, phương thức nào được sử dụng để thêm một phần tử vào cuối mảng?",
        type: QuestionType.MULTIPLE_CHOICE,
        options: ["push()", "append()", "addToEnd()", "insert()"],
        correctOption: 0,
        points: 1
      },
      {
        id: 2,
        content: "Giải thích cách hoạt động của Virtual DOM trong React và so sánh với DOM thực.",
        type: QuestionType.ESSAY,
        points: 5
      }
    ],
    status: ExamStatus.PUBLISHED,
    createdAt: "2024-03-20T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ JavaScript - Lần 1",
    description: "Kiểm tra kiến thức cơ bản về JavaScript",
    duration: 60,
    questions: [
      {
        id: 3,
        content: "Trong CSS, thuộc tính display: flex được sử dụng để làm gì?",
        type: QuestionType.MULTIPLE_CHOICE,
        options: ["Ẩn phần tử", "Tạo layout linh hoạt", "Thêm animation", "Thay đổi màu sắc"],
        correctOption: 1,
        points: 1
      },
      {
        id: 4,
        content: "Phân biệt giữa let, const và var trong JavaScript.",
        type: QuestionType.ESSAY,
        points: 3
      }
    ],
    status: ExamStatus.DRAFT,
    createdAt: "2024-03-19T15:30:00.000Z"
  }
];

const ExamList: React.FC = () => {
  const { exams, deleteExam } = useExam();
  const [selectedExam, setSelectedExam] = useState<typeof exams[0] | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleDelete = (id: number) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đề thi này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteExam(id);
        message.success('Đã xóa đề thi');
      },
    });
  };

  const handlePreview = (exam: typeof exams[0]) => {
    setSelectedExam(exam);
    setIsPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Tên đề thi',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Số câu hỏi',
      key: 'questionCount',
      render: (record: Exam) => (
        <Space>
          <Tag color="blue">
            {record.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).length} Trắc nghiệm
          </Tag>
          <Tag color="green">
            {record.questions.filter(q => q.type === QuestionType.ESSAY).length} Tự luận
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ExamStatus) => {
        const colors = {
          [ExamStatus.DRAFT]: 'default',
          [ExamStatus.PUBLISHED]: 'success',
          [ExamStatus.COMPLETED]: 'warning',
          [ExamStatus.ARCHIVED]: 'error',
        };
        const labels = {
          [ExamStatus.DRAFT]: 'Nháp',
          [ExamStatus.PUBLISHED]: 'Đã xuất bản',
          [ExamStatus.COMPLETED]: 'Đã hoàn thành',
          [ExamStatus.ARCHIVED]: 'Đã lưu trữ',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Exam) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            Xem
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />}
            onClick={() => message.info('Chức năng chỉnh sửa đang được phát triển')}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        dataSource={exams}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Chi tiết đề thi"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {selectedExam && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedExam.title}</h3>
              <p className="text-gray-500">{selectedExam.description}</p>
            </div>
            
            <div className="space-y-2">
              <p><strong>Thời gian:</strong> {selectedExam.duration} phút</p>
              <p><strong>Trạng thái:</strong> {selectedExam.status}</p>
              <p><strong>Ngày tạo:</strong> {new Date(selectedExam.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Danh sách câu hỏi:</h4>
              {selectedExam.questions.map((question, index) => (
                <div key={question.id} className="border p-4 rounded-lg">
                  <p className="font-medium">Câu {index + 1}: {question.content}</p>
                  <p className="text-gray-500">
                    Loại: {question.type === QuestionType.MULTIPLE_CHOICE ? 'Trắc nghiệm' : 'Tự luận'}
                  </p>
                  {question.type === QuestionType.MULTIPLE_CHOICE && question.options && (
                    <div className="ml-4 mt-2">
                      {question.options.map((option, optIndex) => (
                        <p key={optIndex} className={optIndex === question.correctOption ? 'text-green-600 font-medium' : ''}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === question.correctOption && ' ✓'}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-500 mt-2">Điểm: {question.points}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamList; 