import React, { useState } from "react";
import { Avatar, Space, Typography, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Profile from '../../pages/Profile';
import { motion } from "framer-motion";
import { MessageDropdown } from "./MessageDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchComponent } from "./SearchBar";
import { useAvatar } from "../../hooks/useAvatar";
import { useUsers } from "../../hooks/useUsers";

const CustomHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me } = useUsers();
  const { imageUrl, isLoading } = useAvatar(me?.avatarUrl);

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
      <Typography.Title
        level={3}
        className="!m-0 forest--dark--color"
      >
        Welcome to IoT Lab - Học viện Công nghệ Bưu chính Viễn thông
      </Typography.Title>

      <Space align="center" size="large">
        <SearchComponent onSearch={onSearch} />

        <Space align="center" size="middle">
          <MessageDropdown />
          <NotificationDropdown />
          <motion.div whileHover={{ scale: 1.05 }}>
            <Avatar
              size="large"
              icon={isLoading ? <Spin /> : <UserOutlined />}
              src={!isLoading ? imageUrl : undefined}
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
