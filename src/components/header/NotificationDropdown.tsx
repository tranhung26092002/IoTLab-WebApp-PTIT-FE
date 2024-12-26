import { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { Badge, Dropdown } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { Notification } from '../../types/notification';
import { NotificationContent } from '../notification/NotificationContent';
import { NotificationDetail } from '../notification/NotificationDetail';

interface NotificationDropdownProps {
    notifications: Notification[];
    isLoading: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, isLoading }) => {
    const { user } = useAuth();
    const {
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
    } = useNotification(user?.id || 0);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    const unreadNotifications = notifications.filter(n => !n.read);
    const unreadCount = unreadNotifications.length;

    return (
        <>
            <Dropdown
                overlay={(
                    <NotificationContent
                        notifications={notifications}
                        onNotificationClick={handleNotificationClick}
                        onClear={deleteNotification}
                        onClearAll={deleteAllNotifications}
                        onReadAll={markAllAsRead}
                        isLoading={isLoading}
                    />
                )}
                trigger={['click']}
                placement="bottomRight"
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <div>
                    <Badge count={unreadCount}>
                        <NotificationOutlined className="bg-[#d2e3c8] p-2 rounded-md text-sm text-[#4f6f52] cursor-pointer" />
                    </Badge>
                </div>
            </Dropdown>
            <NotificationDetail
                notification={selectedNotification}
                visible={!!selectedNotification}
                onClose={() => setSelectedNotification(null)}
            />
        </>
    );
};