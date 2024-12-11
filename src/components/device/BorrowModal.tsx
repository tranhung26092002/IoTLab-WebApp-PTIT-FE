// BorrowModal.tsx
import React from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { Device, CreateBorrowRequest } from '../../types/hardDevice';
import dayjs from 'dayjs';

// Updated interface to handle form data
interface BorrowFormData {
    notes?: string;
    expiredAt: dayjs.Dayjs; // Use dayjs type for DatePicker
}

interface Props {
    visible: boolean;
    device: Device | null;
    onCancel: () => void;
    onSubmit: (values: CreateBorrowRequest) => void;
    loading: boolean;
}

export const BorrowModal: React.FC<Props> = ({
    visible,
    device,
    onCancel,
    onSubmit,
    loading
}) => {
    const [form] = Form.useForm<BorrowFormData>();

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const handleSubmit = (values: BorrowFormData) => {
        if (!device) return;

        const formattedDate = values.expiredAt.format('YYYY-MM-DD');

        onSubmit({
            deviceId: device.id,
            notes: values.notes,
            expiredAt: formattedDate // Use formatted date without time
        });
    };

    return (
        <Modal
            title={`Borrow Device: ${device?.name} (${device?.code})`}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    name="expiredAt"
                    label="Expected Return Date"
                    rules={[{ required: true, message: 'Please select expected return date' }]}
                >
                    <DatePicker
                        className="w-full"
                        disabledDate={(current) => current && current.valueOf() < Date.now()}
                        format="DD/MM/YYYY"
                        picker="date" // Enforce date-only picker
                    />
                </Form.Item>

                <Form.Item
                    name="notes"
                    label="Notes"
                    rules={[{ max: 500, message: 'Notes cannot exceed 500 characters' }]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter any additional notes"
                    />
                </Form.Item>

                <div className="flex justify-end space-x-2">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={!device || device.status === 'BORROWED'}
                    >
                        Confirm Borrow
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};