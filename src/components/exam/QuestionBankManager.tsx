import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { QuestionType, QuestionDifficulty } from '../../types/exam';
import { sampleQuestions, Question } from '../../data/sampleQuestions';
import * as XLSX from 'xlsx';

const { TextArea } = Input;
const { confirm } = Modal;

const QuestionBankManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);

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
      onOk() {
        setQuestions(questions.filter(q => q.id !== id));
        message.success('Đã xóa câu hỏi');
      },
    });
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const newQuestions = jsonData.map((row: any) => ({
          id: Math.floor(Math.random() * 10000),
          content: row.Content,
          type: row.Type === 'MULTIPLE_CHOICE' ? QuestionType.MULTIPLE_CHOICE : QuestionType.ESSAY,
          difficulty: row.Difficulty as QuestionDifficulty,
          category: row.Category,
          options: row.Type === 'MULTIPLE_CHOICE' ? row.Options?.split('|') : undefined,
          correctOption: row.Type === 'MULTIPLE_CHOICE' ? Number(row.CorrectOption) : undefined,
          points: Number(row.Points) || 1,
        }));

        setQuestions([...questions, ...newQuestions]);
        message.success('Đã import thành công ' + newQuestions.length + ' câu hỏi');
      } catch (error) {
        message.error('Có lỗi xảy ra khi import file');
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newQuestion: Question = {
        id: Math.floor(Math.random() * 10000),
        content: values.content,
        type: values.type,
        difficulty: values.difficulty,
        category: values.category,
        points: values.points,
        ...(values.type === QuestionType.MULTIPLE_CHOICE && {
          options: values.options.split('\\n').filter(Boolean),
          correctOption: values.correctOption,
        }),
      };

      setQuestions([...questions, newQuestion]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Đã thêm câu hỏi mới');
    });
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
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: QuestionDifficulty) => {
        const colors = {
          [QuestionDifficulty.EASY]: 'success',
          [QuestionDifficulty.MEDIUM]: 'warning',
          [QuestionDifficulty.HARD]: 'error',
        };
        return <Tag color={colors[difficulty]}>{difficulty}</Tag>;
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
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
            <Button icon={<UploadOutlined />}>Import Excel</Button>
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
      />

      <Modal
        title="Thêm câu hỏi mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
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
            name="difficulty"
            label="Độ khó"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={QuestionDifficulty.EASY}>Dễ</Select.Option>
              <Select.Option value={QuestionDifficulty.MEDIUM}>Trung bình</Select.Option>
              <Select.Option value={QuestionDifficulty.HARD}>Khó</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="points"
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