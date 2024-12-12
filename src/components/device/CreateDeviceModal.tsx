import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, Upload, Image } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { Device } from '../../types/hardDevice';
import defaultImage from '../../assets/default-device.png';

interface Props {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: Partial<Device>, file?: File) => Promise<void>;
    isLoading: boolean;
}

export const CreateDeviceModal: React.FC<Props> = ({
    visible,
    onCancel,
    onSubmit,
    isLoading
}) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleImageChange = (file: File) => {
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        return false;
    };

    const handleSubmit = async (values: Partial<Device>) => {
        await onSubmit(values, imageFile || undefined);
        form.resetFields();
        setImageFile(null);
        setImagePreview('');
    };

    return (
        <Modal
            title="Create New Device"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="mb-4 text-center">
                    <Upload
                        showUploadList={false}
                        beforeUpload={handleImageChange}
                    >
                        <div className="cursor-pointer">
                            <Image
                                src={imagePreview || defaultImage}
                                alt="device"
                                width={200}
                                height={200}
                                style={{ objectFit: 'contain' }}
                            />
                            <Button icon={<CameraOutlined />} className="mt-2">
                                Upload Image
                            </Button>
                        </div>
                    </Upload>
                </div>

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input device name!' }]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    name="code"
                    label="Code"
                    rules={[{ required: true, message: 'Please input device code!' }]}
                >
                    <Input />
                </Form.Item> */}

                <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: 'Please input device type!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item className="flex justify-end mb-0">
                    <Space>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Create
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};