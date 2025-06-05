import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ExamStatus, QuestionType, Exam } from '../../types/exam';
import { useExam } from '../../hooks/useExam';

const { TextArea } = Input;
const { confirm } = Modal;

interface ExamTemplateManagerProps {
  exams: Exam[];
  isLoading: boolean;
}

const ExamTemplateManager: React.FC<ExamTemplateManagerProps> = ({ exams, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const {
    createExam,
    deleteExam,
    isCreating
  } = useExam();

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
      onOk: async () => {
        try {
          await deleteExam(id);
          message.success('Đã xóa mẫu đề');
        } catch (error) {
          message.error('Không thể xóa mẫu đề');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newExam = {
        title: values.title,
        description: values.description
      };

      await createExam(newExam);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Đã thêm mẫu đề mới');
    } catch (error) {
      message.error('Không thể thêm mẫu đề');
    }
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ExamStatus) => {
        const colors = {
          [ExamStatus.NOT_STARTED]: 'default',
          [ExamStatus.IN_PROGRESS]: 'processing',
          [ExamStatus.SUBMITTED]: 'success'
        };
        const labels = {
          [ExamStatus.NOT_STARTED]: 'Chưa bắt đầu',
          [ExamStatus.IN_PROGRESS]: 'Đang làm',
          [ExamStatus.SUBMITTED]: 'Đã nộp'
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Exam) => (
        <Space>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm mẫu đề
      </Button>

      <Table
        columns={columns}
        dataSource={exams}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />

      <Modal
        title="Thêm mẫu đề mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        confirmLoading={isCreating}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: ExamStatus.NOT_STARTED }}
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
              <Select.Option value={ExamStatus.NOT_STARTED}>Chưa bắt đầu</Select.Option>
              <Select.Option value={ExamStatus.IN_PROGRESS}>Đang làm</Select.Option>
              <Select.Option value={ExamStatus.SUBMITTED}>Đã nộp</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamTemplateManager; 