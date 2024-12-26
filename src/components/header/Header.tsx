import React, { useState } from "react";
import { Avatar, Space, Typography, Spin, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Profile from "../../pages/Profile";
import { motion } from "framer-motion";
import { MessageDropdown } from "./MessageDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchComponent } from "./SearchBar";
import { useAvatar } from "../../hooks/useAvatar";
import { useUsers } from "../../hooks/useUsers";
import { useNotification } from "../../hooks/useNotification";

const CustomHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me } = useUsers();
  const { imageUrl, isLoading: isAvatarLoading } = useAvatar(me?.avatarUrl);

  const { notifications, isLoading: isNotificationLoading } = useNotification(me?.id || 0);
  const unreadNotifications = notifications.filter(n => !n.read);

  const onSearch = (value: string) => {
    console.log("Search query:", value);
    // Bạn có thể xử lý tìm kiếm ở đây
  };

  return (
    <Space
      direction="horizontal"
      align="center"
      style={{ width: "100%", justifyContent: "space-between" }}
    >
      <Typography.Title level={3} className="!m-0 forest--dark--color">
        Welcome to IoT Lab - Học viện Công nghệ Bưu chính Viễn thông
      </Typography.Title>

      <Space align="center" size="large">
        <SearchComponent onSearch={onSearch} />
        <Space align="center" size="middle">
          <MessageDropdown />
          <Badge count={unreadNotifications.length}>
            <NotificationDropdown
              notifications={notifications}
              isLoading={isNotificationLoading}
            />
          </Badge>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Avatar
              size="large"
              icon={isAvatarLoading ? <Spin /> : <UserOutlined />}
              src={!isAvatarLoading ? imageUrl : undefined}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            />
          </motion.div>
        </Space>
      </Space>

      <Profile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Space>
  );
};

export default CustomHeader;
