import { Modal, Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface ResetPasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: { otp: string; newPassword: string; confirmNewPassword: string }) => void;
    loading: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    visible,
    onClose,
    onSubmit,
    loading,
}) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            console.error('Form validation error:', error);
        }
    };

    return (
        <Modal
            title="Đặt lại mật khẩu"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="otp"
                    label="Mã OTP"
                    rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
                >
                    <Input placeholder="Nhập mã OTP" />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
                </Form.Item>

                <Form.Item
                    name="confirmNewPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item className="mb-0 flex justify-end">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Xác nhận
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
