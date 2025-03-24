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
            title={`Thiết bị đã mượn: ${device?.name} (${device?.code})`}
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
                    label="Ngày trả thiết bị"
                    rules={[{ required: true, message: 'Hãy chọn ngày trả thiết bị!' }]}
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
                    label="Ghi chú"
                    rules={[{ max: 500, message: 'Ghi chú không được vượt quá 500 ký tự!' }]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập ghi chú (nếu có)..."
                    />
                </Form.Item>

                <div className="flex justify-end space-x-2">
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={!device || device.status === 'BORROWED'}
                    >
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};