import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, message, Typography, Form, Input } from 'antd';
import { ExclamationCircleOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { QuestionType, Exam } from '../../types/exam';
import { useExam } from '../../hooks/useExam';

const { confirm } = Modal;
const { Title, Text } = Typography;
const { TextArea } = Input;

const ExamList: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    exams,
    isLoading,
    deleteExam,
    updateExam,
    createExam,
    isDeleting,
    isUpdating,
    isCreating
  } = useExam({ enableExams: true, page, size: pageSize });

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
          message.success('Đã xóa đề thi thành công');
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

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    form.setFieldsValue({
      title: exam.title,
      description: exam.description
    });
    setIsEditModalVisible(true);
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      await createExam({
        title: values.title,
        description: values.description
      });
      message.success('Đã tạo đề thi thành công');
      setIsCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      message.error('Không thể tạo đề thi');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingExam) return;

    try {
      await updateExam({
        id: editingExam.id,
        exam: {
          title: values.title,
          description: values.description
        }
      });
      message.success('Đã cập nhật đề thi thành công');
      setIsEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Không thể cập nhật đề thi');
    }
  };

  const formatDate = (dateArray: number[]) => {
    return new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5],
      dateArray[6] / 1000000
    ).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'Tên đề thi',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '15%',
      render: (title: string) => (
        <Text strong>{title}</Text>
      ),
    },
    {
      title: 'Số câu hỏi',
      key: 'questionCount',
      width: '20%',
      render: (record: Exam) => (
        <Space size="middle">
          <Tag color="blue" className="px-3 py-1">
            {record.questions.filter(q => q.question.type === QuestionType.MULTIPLE_CHOICE).length} Trắc nghiệm
          </Tag>
          <Tag color="green" className="px-3 py-1">
            {record.questions.filter(q => q.question.type === QuestionType.ESSAY).length} Tự luận
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: (date: number[]) => formatDate(date),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '20%',
      render: (date: number[]) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '25%',
      render: (_: any, record: Exam) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            className="flex items-center"
          >
            Xem
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            loading={isUpdating}
            className="flex items-center"
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={isDeleting}
            className="flex items-center"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const renderQuestionContent = (question: any, index: number) => {
    const isMultipleChoice = question.question.type === QuestionType.MULTIPLE_CHOICE;
    
    return (
      <div key={question.id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <Text strong className="text-lg">
            Câu {index + 1}: {question.question.content}
          </Text>
          <Tag color={isMultipleChoice ? "blue" : "green"} className="ml-2">
            {isMultipleChoice ? "Trắc nghiệm" : "Tự luận"}
          </Tag>
        </div>
        
        {isMultipleChoice && question.question.options && (
          <div className="ml-4 mt-3 space-y-2">
            {question.question.options.map((option: any) => (
              <div 
                key={option.id} 
                className={`p-2 rounded ${
                  option.correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <Text className={option.correct ? "text-green-600 font-medium" : ""}>
                  {option.option}. {option.content}
                  {option.correct && " ✓"}
                </Text>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex justify-end">
          <Tag color="purple">Điểm: {question.question.score}</Tag>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="flex items-center"
        >
          Tạo đề thi mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={exams?.data || []}
        rowKey="id"
        pagination={{ 
          current: page + 1,
          pageSize: pageSize,
          total: exams?.metaData?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} đề thi`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage - 1);
            setPageSize(newPageSize);
          }
        }}
        loading={isLoading}
        className="exam-list-table"
      />

      {/* Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined />
            <span>Chi tiết đề thi</span>
          </div>
        }
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={800}
        className="exam-preview-modal"
      >
        {selectedExam && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={4} className="mb-2">{selectedExam.title}</Title>
              <Text type="secondary">{selectedExam.description}</Text>
              <div className="mt-2">
                <Text type="secondary">Ngày tạo: {formatDate(selectedExam.createdAt)}</Text>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-2">
                <Title level={5}>Phần 1: Câu hỏi trắc nghiệm</Title>
              </div>
              {selectedExam.questions
                .filter(q => q.question.type === QuestionType.MULTIPLE_CHOICE)
                .map((question, index) => renderQuestionContent(question, index))}

              <div className="border-b pb-2 mt-6">
                <Title level={5}>Phần 2: Câu hỏi tự luận</Title>
              </div>
              {selectedExam.questions
                .filter(q => q.question.type === QuestionType.ESSAY)
                .map((question, index) => renderQuestionContent(question, index))}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined />
            <span>Sửa đề thi</span>
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={isUpdating}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="title"
            label="Tên đề thi"
            rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
          >
            <Input placeholder="Nhập tên đề thi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả đề thi" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined />
            <span>Tạo đề thi mới</span>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        confirmLoading={isCreating}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="title"
            label="Tên đề thi"
            rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
          >
            <Input placeholder="Nhập tên đề thi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả đề thi" />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .exam-list-table .ant-table-thead > tr > th {
          background-color: #f5f5f5;
          font-weight: 600;
        }
        .exam-preview-modal .ant-modal-header {
          background-color: #f5f5f5;
          border-bottom: 1px solid #e8e8e8;
        }
      `}</style>
    </div>
  );
};

export default ExamList; 