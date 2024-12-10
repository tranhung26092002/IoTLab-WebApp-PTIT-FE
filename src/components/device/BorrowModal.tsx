import React from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { BorrowFormData, HardDevice } from '../../types/hardDevice';

interface Props {
    visible: boolean;
    device: HardDevice | null;
    onCancel: () => void;
    onSubmit: (values: BorrowFormData) => void;
    loading: boolean;
}

export const BorrowModal: React.FC<Props> = ({
    visible,
    device,
    onCancel,
    onSubmit,
    loading
}) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title={`Borrow ${device?.name}`}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="space-y-4"
            >
                <Form.Item
                    name="studentId"
                    label="Student ID"
                    rules={[{ required: true, message: 'Please enter student ID' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="studentName"
                    label="Student Name"
                    rules={[{ required: true, message: 'Please enter student name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="expectedReturnDate"
                    label="Expected Return Date"
                >
                    <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item name="notes" label="Notes">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Confirm
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};