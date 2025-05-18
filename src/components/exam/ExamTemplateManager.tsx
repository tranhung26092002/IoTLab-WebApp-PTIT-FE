import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ExamStatus, QuestionType, QuestionDifficulty } from '../../types/exam';
import { useExam } from '../../contexts/ExamContext.tsx';
import { sampleQuestions } from '../../data/sampleQuestions';

const { TextArea } = Input;
const { confirm } = Modal;

interface ExamTemplate {
  id: number;
  title: string;
  description: string;
  duration: number;
  multipleChoiceCount: number;
  essayCount: number;
  status: ExamStatus;
  createdAt: string;
}

interface Question {
  id: number;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  category: string;
  options?: string[];
  correctOption?: number;
  points: number;
}

interface Exam {
  id: number;
  templateId: number;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  status: ExamStatus;
  createdAt: string;
}

// Dữ liệu mẫu cho mẫu đề thi
const sampleTemplates: ExamTemplate[] = [
  {
    id: 1,
    title: "Đề thi cuối kỳ IoT",
    description: "Đề thi đánh giá kiến thức về IoT, giao thức và ứng dụng",
    duration: 90,
    multipleChoiceCount: 4,
    essayCount: 2,
    status: ExamStatus.PUBLISHED,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ IoT",
    description: "Kiểm tra kiến thức cơ bản về IoT",
    duration: 60,
    multipleChoiceCount: 3,
    essayCount: 1,
    status: ExamStatus.DRAFT,
    createdAt: new Date().toISOString()
  }
];

const ExamTemplateManager: React.FC = () => {
  const { addExam } = useExam();
  const [templates, setTemplates] = useState<ExamTemplate[]>(sampleTemplates);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa mẫu đề này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setTemplates(templates.filter(t => t.id !== id));
        message.success('Đã xóa mẫu đề');
      },
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newTemplate: ExamTemplate = {
        id: Math.floor(Math.random() * 10000),
        title: values.title,
        description: values.description,
        duration: values.duration,
        multipleChoiceCount: values.multipleChoiceCount,
        essayCount: values.essayCount,
        status: values.status,
        createdAt: new Date().toISOString(),
      };

      setTemplates([...templates, newTemplate]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Đã thêm mẫu đề mới');
    });
  };

  const columns = [
    {
      title: 'Tên mẫu đề',
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
      render: (record: ExamTemplate) => (
        <Space>
          <Tag color="blue">{record.multipleChoiceCount} Trắc nghiệm</Tag>
          <Tag color="green">{record.essayCount} Tự luận</Tag>
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
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ExamTemplate) => (
        <Space>
          <Button type="primary" onClick={() => handleGenerateExam(record)}>
            Tạo đề
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleGenerateExam = (template: ExamTemplate) => {
    // Lấy ngẫu nhiên câu hỏi trắc nghiệm
    const multipleChoiceQuestions = sampleQuestions
      .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
      .sort(() => Math.random() - 0.5)
      .slice(0, template.multipleChoiceCount);

    // Lấy ngẫu nhiên câu hỏi tự luận
    const essayQuestions = sampleQuestions
      .filter(q => q.type === QuestionType.ESSAY)
      .sort(() => Math.random() - 0.5)
      .slice(0, template.essayCount);

    const newExam = {
      id: Math.floor(Math.random() * 10000),
      title: `${template.title} - Lần ${new Date().getTime()}`,
      description: template.description,
      duration: template.duration,
      questions: [...multipleChoiceQuestions, ...essayQuestions],
      status: ExamStatus.DRAFT,
      createdAt: new Date().toISOString()
    };

    addExam(newExam);
    message.success('Đã tạo đề thi mới từ mẫu');
  };

  return (
    <div className="space-y-4">
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm mẫu đề
      </Button>

      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Thêm mẫu đề mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: ExamStatus.DRAFT }}
        >
          <Form.Item
            name="title"
            label="Tên mẫu đề"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian làm bài (phút)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Space size="large" className="w-full">
            <Form.Item
              name="multipleChoiceCount"
              label="Số câu trắc nghiệm"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name="essayCount"
              label="Số câu tự luận"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Space>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={ExamStatus.DRAFT}>Nháp</Select.Option>
              <Select.Option value={ExamStatus.PUBLISHED}>Xuất bản</Select.Option>
              <Select.Option value={ExamStatus.ARCHIVED}>Lưu trữ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamTemplateManager; 