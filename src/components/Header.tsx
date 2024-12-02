import React from "react";
import { Avatar, Space, Typography, Input } from "antd";
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const MyHeader: React.FC = () => {
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
        Welcome to Dashboard, HungTran
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
          <Avatar size="large" icon={<UserOutlined />} />
        </Space>
      </Space>
    </Space>
  );
};

export default MyHeader;
