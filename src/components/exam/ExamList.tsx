import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, message } from 'antd';
import { ExclamationCircleOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { QuestionType, Exam } from '../../types/exam';
import { useExam } from '../../hooks/useExam';

const { confirm } = Modal;

interface ExamListProps {
  exams: Exam[];
  isLoading: boolean;
}

const ExamList: React.FC<ExamListProps> = ({ exams, isLoading }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const {
    deleteExam,
    updateExam,
    isDeleting,
    isUpdating
  } = useExam();

  const handleDelete = (id: number) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đề thi này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteExam(id);
          message.success('Đã xóa đề thi');
        } catch (error) {
          message.error('Không thể xóa đề thi');
        }
      },
    });
  };

  const handlePreview = (exam: Exam) => {
    setSelectedExam(exam);
    setIsPreviewVisible(true);
  };

  const handleUpdate = async (id: number, exam: Partial<Exam>) => {
    try {
      await updateExam({ id, exam });
      message.success('Đã cập nhật đề thi');
    } catch (error) {
      message.error('Không thể cập nhật đề thi');
    }
  };

  const columns = [
    {
      title: 'Tên đề thi',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Số câu hỏi',
      key: 'questionCount',
      render: (record: Exam) => (
        <Space>
          <Tag color="blue">
            {record.questions.filter(q => q.question.type === QuestionType.MULTIPLE_CHOICE).length} Trắc nghiệm
          </Tag>
          <Tag color="green">
            {record.questions.filter(q => q.question.type === QuestionType.ESSAY).length} Tự luận
          </Tag>
        </Space>
      ),
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
            onClick={() => handleUpdate(record.id, { title: record.title })}
            loading={isUpdating}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={isDeleting}
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
        loading={isLoading}
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
              <p><strong>Ngày tạo:</strong> {new Date(selectedExam.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Danh sách câu hỏi:</h4>
              {selectedExam.questions.map((examQuestion, index) => (
                <div key={examQuestion.id} className="border p-4 rounded-lg">
                  <p className="font-medium">Câu {index + 1}: {examQuestion.question.content}</p>
                  <p className="text-gray-500">
                    Loại: {examQuestion.question.type === QuestionType.MULTIPLE_CHOICE ? 'Trắc nghiệm' : 'Tự luận'}
                  </p>
                  {examQuestion.question.type === QuestionType.MULTIPLE_CHOICE && examQuestion.question.options && (
                    <div className="ml-4 mt-2">
                      {examQuestion.question.options.map((option, optIndex) => (
                        <p key={optIndex} className={option.isCorrect ? 'text-green-600 font-medium' : ''}>
                          {option.option}. {option.content}
                          {option.isCorrect && ' ✓'}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-500 mt-2">Điểm: {examQuestion.question.score}</p>
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