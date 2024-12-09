import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface ForgotPasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: (phone: string) => void;
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
            const values = await form.validateFields();
            let { phoneNumber } = values;

            if (/^0[0-9]{9}$/.test(phoneNumber)) {
                phoneNumber = phoneNumber.replace(/^0/, "+84");
            }

            await onSuccess(phoneNumber);
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
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^(\+84|0)[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập số điện thoại"
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
