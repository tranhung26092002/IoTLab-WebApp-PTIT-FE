import React from 'react';
import { Modal, Typography, Button, Space } from 'antd';
import { ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TimeWarningModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

const TimeWarningModal: React.FC<TimeWarningModalProps> = ({
    open,
    onClose,
    onSubmit,
    isSubmitting = false
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-[#ff4d4f]">
                    <ClockCircleOutlined />
                    <span>Sắp hết thời gian!</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button 
                    key="cancel" 
                    onClick={onClose}
                >
                    Tiếp tục làm bài
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    danger
                    onClick={onSubmit}
                    loading={isSubmitting}
                >
                    Nộp bài ngay
                </Button>,
            ]}
            centered
            closable={false}
            maskClosable={false}
        >
            <div className="text-center space-y-4">
                <ExclamationCircleOutlined className="text-5xl text-[#ff4d4f]" />
                <div>
                    <Text className="text-lg block mb-2">
                        Còn 5 phút nữa là hết thời gian làm bài!
                    </Text>
                    <Text type="secondary">
                        Bạn có muốn nộp bài ngay bây giờ không?
                    </Text>
                </div>
                <div className="p-3 bg-[#fff2f0] rounded-lg">
                    <Text type="danger">
                        Lưu ý: Bài thi sẽ tự động được nộp khi hết thời gian.
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

export default TimeWarningModal; 