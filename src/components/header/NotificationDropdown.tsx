import React from 'react';
import { Dropdown, List, Typography, Badge, Spin, Avatar } from 'antd';
import { BellOutlined, NotificationOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Notification } from '../../types/notification';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const NotificationTooltipContent: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-64 p-2"
    >
        <div className="flex items-center gap-3 mb-2">
            <Avatar 
                icon={<NotificationOutlined />} 
                className="bg-[#4f6f52]"
                size="small"
            />
            <div>
                <Typography.Text strong className="text-white">
                    Thông báo
                </Typography.Text>
                <Typography.Text className="block text-xs text-white/80">
                    Cập nhật mới nhất
                </Typography.Text>
            </div>
        </div>
        <Typography.Text className="block text-xs text-white/90 mb-2">
            Nhận thông báo về:
        </Typography.Text>
        <ul className="list-disc list-inside text-xs text-white/80 space-y-0.5 ml-1">
            <li>Cập nhật hệ thống</li>
            <li>Thông báo từ giảng viên</li>
            <li>Lịch thực hành</li>
            <li>Hoạt động thiết bị</li>
        </ul>
    </motion.div>
);

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  children?: React.ReactNode;
}

const NotificationContent: React.FC<{ notifications: Notification[]; isLoading: boolean }> = ({ notifications, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-80 bg-white rounded-lg shadow-lg p-4"
  >
    <div className="flex items-center justify-between mb-4">
      <Typography.Title level={5} className="!m-0">Thông báo</Typography.Title>
      <Badge count={notifications.filter(n => !n.read).length} />
    </div>
    {isLoading ? (
      <div className="flex justify-center p-4">
        <Spin />
      </div>
    ) : (
      <List
        dataSource={notifications}
        renderItem={notification => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <List.Item className={`rounded-lg p-2 mb-2 ${!notification.read ? 'bg-[#f0f5f1]' : ''}`}>
              <List.Item.Meta
                title={notification.title}
                description={notification.message}
              />
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.createdAt), { 
                  addSuffix: true,
                  locale: vi 
                })}
              </div>
            </List.Item>
          </motion.div>
        )}
        locale={{ emptyText: 'Không có thông báo mới' }}
      />
    )}
  </motion.div>
);

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, isLoading, children }) => {
  return (
    <Dropdown
      overlay={<NotificationContent notifications={notifications} isLoading={isLoading} />}
      trigger={['click']}
      placement="bottomRight"
    >
      {children || (
        <BellOutlined className="text-xl p-2 rounded-full bg-[#d2e3c8] text-[#4F6F52] hover:bg-[#86A789] hover:text-white transition-all duration-300" />
      )}
    </Dropdown>
  );
};