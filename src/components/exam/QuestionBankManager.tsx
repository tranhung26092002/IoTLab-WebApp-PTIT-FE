import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { QuestionType, Question } from '../../types/exam';
import { useQuestion } from '../../hooks/useQuestion';
import * as XLSX from 'xlsx';

const { TextArea } = Input;
const { confirm } = Modal;

interface QuestionBankManagerProps {
  questions: Question[];
  isLoading: boolean;
}

const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({ questions, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  
  const { 
    createMultipleChoiceQuestion,
    createEssayQuestion,
    deleteQuestion,
    importQuestions,
    isCreatingMultipleChoice,
    isCreatingEssay,
    isDeleting,
    isImporting
  } = useQuestion();

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteQuestion(id);
          message.success('Đã xóa câu hỏi');
        } catch (error) {
          message.error('Không thể xóa câu hỏi');
        }
      },
    });
  };

  const handleImport = async (file: File) => {
    try {
      await importQuestions(file);
      message.success('Đã import câu hỏi thành công');
    } catch (error) {
      message.error('Không thể import câu hỏi');
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newQuestion = {
        content: values.content,
        type: values.type,
        difficulty: values.difficulty,
        category: values.category,
        score: values.score,
        ...(values.type === QuestionType.MULTIPLE_CHOICE && {
          options: values.options.split('\\n').filter(Boolean).map((content: string, index: number) => ({
            option: String.fromCharCode(65 + index),
            content,
            isCorrect: index === values.correctOption
          }))
        })
      };

      if (values.type === QuestionType.MULTIPLE_CHOICE) {
        await createMultipleChoiceQuestion(newQuestion);
      } else {
        await createEssayQuestion(newQuestion);
      }

      setIsModalVisible(false);
      form.resetFields();
      message.success('Đã thêm câu hỏi mới');
    } catch (error) {
      message.error('Không thể thêm câu hỏi');
    }
  };

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: QuestionType) => (
        <Tag color={type === QuestionType.MULTIPLE_CHOICE ? 'blue' : 'green'}>
          {type === QuestionType.MULTIPLE_CHOICE ? 'Trắc nghiệm' : 'Tự luận'}
        </Tag>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Question) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm câu hỏi
          </Button>
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={handleImport}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} loading={isImporting}>
              Import Excel
            </Button>
          </Upload>
        </Space>
        <Button type="link" href="/template.xlsx">
          Tải mẫu Excel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />

      <Modal
        title="Thêm câu hỏi mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        confirmLoading={isCreatingMultipleChoice || isCreatingEssay}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: QuestionType.MULTIPLE_CHOICE }}
        >
          <Form.Item
            name="type"
            label="Loại câu hỏi"
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => setSelectedType(value)}>
              <Select.Option value={QuestionType.MULTIPLE_CHOICE}>Trắc nghiệm</Select.Option>
              <Select.Option value={QuestionType.ESSAY}>Tự luận</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung câu hỏi"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {selectedType === QuestionType.MULTIPLE_CHOICE && (
            <>
              <Form.Item
                name="options"
                label="Các đáp án (mỗi đáp án một dòng)"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} placeholder="Đáp án A&#13;&#10;Đáp án B&#13;&#10;Đáp án C&#13;&#10;Đáp án D" />
              </Form.Item>

              <Form.Item
                name="correctOption"
                label="Đáp án đúng (0-3)"
                rules={[{ required: true }]}
              >
                <Input type="number" min={0} max={3} />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="score"
            label="Điểm"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionBankManager; 