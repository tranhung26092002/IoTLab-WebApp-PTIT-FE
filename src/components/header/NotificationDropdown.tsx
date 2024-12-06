// components/Header/NotificationDropdown.tsx
import React, { useState } from 'react';
import { Badge, Dropdown, List, Modal, Button } from 'antd';
import { NotificationOutlined, BellFilled, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    description?: string;
    isRead: boolean;
}

const NotificationDetail: React.FC<{
    notification: Notification | null;
    visible: boolean;
    onClose: () => void;
}> = ({ notification, visible, onClose }) => (
    <Modal
        title={notification?.title}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={500}
    >
        <div className="p-4">
            <h3 className="text-lg font-semibold">{notification?.message}</h3>
            <p className="text-gray-600 mt-2">{notification?.description || "No detailed description available."}</p>
            <p className="text-sm text-gray-400 mt-4">{notification?.time}</p>
        </div>
    </Modal>
);

const NotificationContent: React.FC<{
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onClear: (id: number) => void;
    onClearAll: () => void;
    onReadAll: () => void;
}> = ({ notifications, onNotificationClick, onClear, onClearAll, onReadAll }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-80 bg-white rounded-lg shadow-lg"
    >
        <div className="p-2 border-b flex justify-between items-center">
            <div className="space-x-2">
                <Button size="small" onClick={onClearAll} icon={<DeleteOutlined />}>
                    Clear All
                </Button>
                <Button size="small" onClick={onReadAll} icon={<CheckOutlined />}>
                    Read All
                </Button>
            </div>
        </div>
        <List
            className="max-h-96 overflow-y-auto"
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
                <List.Item
                    className={`p-4 hover:bg-gray-50 transition-all cursor-pointer relative ${!item.isRead ? 'bg-blue-50' : ''
                        }`}
                    onClick={() => onNotificationClick(item)}
                >
                    <List.Item.Meta
                        avatar={<BellFilled className={`${!item.isRead ? 'text-blue-500' : 'text-gray-400'}`} />}
                        title={<span className={!item.isRead ? 'font-semibold' : ''}>{item.title}</span>}
                        description={
                            <div className="flex flex-col">
                                <span>{item.message}</span>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </div>
                        }
                    />
                    <Button
                        size="small"
                        type="text"
                        className="absolute right-2 top-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear(item.id);
                        }}
                        icon={<DeleteOutlined />}
                    />
                </List.Item>
            )}
        />
    </motion.div>
);

export const NotificationDropdown: React.FC = () => {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: 'New Alert',
            message: 'Temperature alert',
            time: '2m ago',
            description: 'Temperature has exceeded the threshold in Zone A.',
            isRead: false
        },
        {
            id: 2,
            title: 'System Update',
            message: 'Update available',
            time: '1h ago',
            description: 'A new system update is available. Please review and install.',
            isRead: false
        }
    ]);

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        setNotifications(notifications.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
        ));
    };

    const handleClear = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleReadAll = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <Dropdown
                overlay={
                    <NotificationContent
                        notifications={notifications}
                        onNotificationClick={handleNotificationClick}
                        onClear={handleClear}
                        onClearAll={handleClearAll}
                        onReadAll={handleReadAll}
                    />
                }
                trigger={['click']}
                placement="bottomRight"
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