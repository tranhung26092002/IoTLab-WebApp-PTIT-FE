import React, { useState } from "react";
import { Avatar, Space, Typography, Input } from "antd";
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Profile from '../pages/Profile';

const { Search } = Input;

const MyHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Typography.Title level={3} type="secondary" style={{ margin: 0 }}>
        Welcome to IoT Lab - Học viện Công nghệ Bưu chính Viễn thông
      </Typography.Title>

      <Space align="center" size="large">
        <Search
          placeholder="Search Dashboard"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />

        <Space align="center" size="middle">
          <MessageOutlined className="header-icon" />
          <NotificationOutlined className="header-icon" />
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={`https://i.pravatar.cc/150?img=${2}`}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          />
        </Space>
      </Space>

      <Profile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Space>
  );
};

export default MyHeader;
