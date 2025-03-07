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
      title="Create New Practice"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Create
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
          label="Title"
          rules={[{ required: true, message: 'Please enter title' }]}
        >
          <Input placeholder="Enter practice title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea
            rows={4}
            placeholder="Enter practice description"
          />
        </Form.Item>

        <Form.Item
          label="Cover Image"
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
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePracticeModal;