import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface ForgotPasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: (email: string) => void;
    loading: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    visible,
    onClose,
    onSuccess,
    loading
}) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const { email } = await form.validateFields();
            await onSuccess(email);
            form.resetFields();
        } catch (error) {
            console.error('Form validation error:', error);
        }
    };

    return (
        <Modal
            title="Quên mật khẩu"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                        {
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Email không đúng định dạng!'
                        }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập email của bạn"
                    />
                </Form.Item>

                <Form.Item className="mb-0 flex justify-end">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tiếp tục
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};