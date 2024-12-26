import { List, Button, Empty, Spin, Card } from 'antd';
import { DeleteOutlined, CheckOutlined, BellOutlined } from '@ant-design/icons';
import { Notification } from '../../types/notification';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface NotificationContentProps {
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onClear: (id: number) => void;
    onClearAll: () => void;
    onReadAll: () => void;
    isLoading: boolean;
}

export const NotificationContent: React.FC<NotificationContentProps> = ({
    notifications,
    onNotificationClick,
    onClear,
    onClearAll,
    onReadAll,
    isLoading
}) => {
    return (
        <Card className="w-[400px] max-h-[500px] overflow-auto shadow-lg">
            <div className="flex items-center justify-between space-x-2 mb-4">
                <span className="font-medium whitespace-nowrap">
                    Notifications ({notifications.length})
                </span>
                <Button size="small" icon={<CheckOutlined />} onClick={onReadAll}>
                    Mark all as read
                </Button>
                <Button size="small" icon={<DeleteOutlined />} danger onClick={onClearAll}>
                    Clear all
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-4">
                    <Spin />
                </div>
            ) : notifications.length > 0 ? (
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            className={`cursor-pointer transition-colors ${!item.read ? 'bg-blue-50' : ''}`}
                            actions={[
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClear(item.id);  // Xóa thông báo khi nhấn vào nút xóa
                                    }}
                                />
                            ]}
                            onClick={() => onNotificationClick(item)}  // Gọi hàm khi nhấn vào thông báo
                        >
                            <List.Item.Meta
                                avatar={<BellOutlined className="text-blue-500" />}
                                title={item.title}  // Hiển thị title
                                description={
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{item.message}</p>
                                        <span className="text-xs text-gray-400">
                                            {dayjs(item.createdAt).fromNow()}
                                        </span>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="No notifications" />
            )}
        </Card>
    );
};
