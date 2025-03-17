import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Practice } from '../../types/practice';

const { TextArea } = Input;

interface CreatePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (practice: Partial<Practice>, file?: File) => Promise<void>;
  isLoading: boolean;
}

const CreatePracticeModal: React.FC<CreatePracticeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values, imageFile || undefined);
      form.resetFields();
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Thêm bài thực hành"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Thêm
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Hãy nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề bài thực hành" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Hãy nhập mô tả' }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả bài thực hành"
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          className="mb-0"
        >
          <Upload
            maxCount={1}
            beforeUpload={(file) => {
              setImageFile(file);
              return false;
            }}
            onRemove={() => setImageFile(null)}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePracticeModal;