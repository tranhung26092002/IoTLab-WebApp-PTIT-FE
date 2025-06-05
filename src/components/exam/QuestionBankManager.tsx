import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { QuestionType, Question } from '../../types/exam';
import { useQuestion } from '../../hooks/useQuestion';
import { PageResponse } from '../../types/PageResponse';

const { TextArea } = Input;
const { confirm } = Modal;

const QuestionBankManager: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const { 
    questions,
    isLoading,
    createMultipleChoiceQuestion,
    createEssayQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestions,
    isCreatingMultipleChoice,
    isCreatingEssay,
    isImporting
  } = useQuestion({ page, size });

  const handleAdd = () => {
    setEditingQuestion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    form.setFieldsValue({
      ...question,
      options: question.type === QuestionType.MULTIPLE_CHOICE 
        ? question.options?.map(opt => opt.content).join('\n')
        : undefined,
      correctOption: question.type === QuestionType.MULTIPLE_CHOICE 
        ? question.options?.findIndex(opt => opt.correct)
        : undefined
    });
    setSelectedType(question.type);
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
      const questionData = {
        content: values.content,
        type: values.type,
        score: values.score,
        ...(values.type === QuestionType.MULTIPLE_CHOICE && {
          options: values.options.split('\n').filter(Boolean).map((content: string, index: number) => ({
            option: String.fromCharCode(65 + index),
            content,
            correct: index === values.correctOption
          }))
        })
      };

      if (editingQuestion) {
        await updateQuestion({ id: editingQuestion.id, question: questionData });
        message.success('Đã cập nhật câu hỏi');
      } else {
        if (values.type === QuestionType.MULTIPLE_CHOICE) {
          await createMultipleChoiceQuestion(questionData);
        } else {
          await createEssayQuestion(questionData);
        }
        message.success('Đã thêm câu hỏi mới');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingQuestion(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current - 1);
    setSize(pagination.pageSize);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: '5%',
      sorter: (a: Question, b: Question) => a.id - b.id,
      defaultSortOrder: 'ascend' as const,
      render: (_: any, record: Question) => record.id,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      width: '35%',
      render: (content: string) => (
        <div className="whitespace-pre-wrap">{content}</div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (type: QuestionType) => (
        <Tag color={type === QuestionType.MULTIPLE_CHOICE ? 'blue' : 'green'}>
          {type === QuestionType.MULTIPLE_CHOICE ? 'Trắc nghiệm' : 'Tự luận'}
        </Tag>
      ),
    },
    {
      title: 'Đáp án',
      key: 'options',
      width: '35%',
      render: (record: Question) => (
        <div className="space-y-2">
          {record.type === QuestionType.MULTIPLE_CHOICE ? (
            record.options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <span className="font-medium">{option.option}.</span>
                <span className={option.correct ? "text-green-600 font-medium" : ""}>
                  {option.content}
                  {option.correct && " ✓"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">Câu hỏi tự luận</div>
          )}
        </div>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      width: '5%',
      align: 'center' as const,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
      align: 'center' as const,
      render: (_: any, record: Question) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            size="small"
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
        dataSource={questions?.data || []}
        rowKey="id"
        pagination={{
          current: (questions?.metaData?.page || 0) + 1,
          pageSize: questions?.metaData?.size || 10,
          total: questions?.metaData?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} câu hỏi`,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onChange={handleTableChange}
        loading={isLoading}
        className="question-bank-table"
      />

      <Modal
        title={editingQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingQuestion(null);
          form.resetFields();
        }}
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