import React from 'react';
import { Form, Input, Switch, Button, Card, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const SystemSettings: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        message.success('Đã lưu cài đặt thành công');
    };

    return (
        <Card title="Cài đặt hệ thống">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    maxFileSize: 10,
                    allowedFileTypes: '.pdf,.doc,.docx,.txt',
                    enableNotifications: true,
                    autoDeleteDays: 30,
                    maxConcurrentUploads: 5
                }}
            >
                <Form.Item
                    label="Kích thước file tối đa (MB)"
                    name="maxFileSize"
                    rules={[{ required: true, message: 'Vui lòng nhập kích thước file tối đa' }]}
                >
                    <Input type="number" min={1} max={100} />
                </Form.Item>

                <Form.Item
                    label="Loại file được phép"
                    name="allowedFileTypes"
                    rules={[{ required: true, message: 'Vui lòng nhập loại file được phép' }]}
                >
                    <Input placeholder=".pdf,.doc,.docx,.txt" />
                </Form.Item>

                <Form.Item
                    label="Bật thông báo"
                    name="enableNotifications"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="Tự động xóa sau (ngày)"
                    name="autoDeleteDays"
                    rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
                >
                    <Input type="number" min={1} max={365} />
                </Form.Item>

                <Form.Item
                    label="Số lượng tải lên đồng thời tối đa"
                    name="maxConcurrentUploads"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng tải lên tối đa' }]}
                >
                    <Input type="number" min={1} max={10} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        Lưu cài đặt
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SystemSettings; 