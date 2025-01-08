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
      style={{
        width: "100%",
        justifyContent: "space-between",
        padding: "16px 32px"
      }}
    >
      {/* Left section - Title */}
      <Typography.Title
        level={1}
        className="!m-0 forest--dark--color"
        style={{
          fontSize: '36px',
          fontWeight: 700,
          textShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      >
        Welcome to IoT Lab - PTIT
      </Typography.Title>

      {/* Right section - Search & Controls */}
      <Space align="center" size={24}>
        <SearchComponent onSearch={onSearch} />
        <MessageDropdown />
        <Badge
          count={unreadNotifications.length}
          size="default"  // Changed from "large" to "default"
          style={{ fontSize: '16px' }}
        >
          <NotificationDropdown
            notifications={notifications}
            isLoading={isNotificationLoading}
          />
        </Badge>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Avatar
            size={48}
            icon={isAvatarLoading ? <Spin /> : <UserOutlined style={{ fontSize: '24px' }} />}
            src={!isAvatarLoading ? imageUrl : undefined}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          />
        </motion.div>
      </Space>

      <Profile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Space>
  );
};

export default CustomHeader;
