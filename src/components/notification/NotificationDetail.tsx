import { Modal, Typography, Tag } from 'antd';
import { Notification } from '../../types/notification';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface NotificationDetailProps {
    notification: Notification | null;
    visible: boolean;
    onClose: () => void;
}

export const NotificationDetail: React.FC<NotificationDetailProps> = ({
    notification,
    visible,
    onClose
}) => {
    if (!notification) return null;

    return (
        <Modal
            title="Notification Details"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400} // Đặt chiều rộng modal cho hợp lý
            className="notification-detail-modal"
        >
            <div className="space-y-4">
                {/* Title and Type */}
                <div>
                    <Title level={4} className="text-2xl font-semibold">{notification.title}</Title>
                    <Tag color={notification.type === 'SUCCESS' ? 'green' : 'blue'}>
                        {notification.type}
                    </Tag>
                </div>

                {/* Message */}
                <div>
                    <Text className="text-lg">{notification.message}</Text>
                </div>

                {/* Date */}
                <div className="text-gray-500 text-sm mt-2">
                    <Text>{dayjs(notification.createdAt).format('MMMM D, YYYY h:mm A')}</Text>
                </div>
            </div>
        </Modal>
    );
};
