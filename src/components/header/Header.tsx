import React, { useState } from "react";
import { Avatar, Space, Typography, Spin, Badge, Dropdown } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Profile from "../../pages/Profile";
import { motion } from "framer-motion";
import { MessageDropdown } from "./MessageDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchComponent } from "./SearchBar";
import { useAvatar } from "../../hooks/useAvatar";
import { useUsers } from "../../hooks/useUsers";
import { useNotification } from "../../hooks/useNotification";
import type { MenuProps } from "antd";
import { useAuth } from "../../hooks/useAuth";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const CustomHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me } = useUsers();
  const { imageUrl, isLoading: isAvatarLoading } = useAvatar(me?.avatarUrl);
  const { notifications, isLoading: isNotificationLoading } = useNotification(me?.id || 0);
  const unreadNotifications = notifications.filter(n => !n.read);
  const { isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    NProgress.start();
    try {
      await signOut();
      NProgress.done();
    } catch (error) {
      NProgress.done();
      console.error('Logout failed:', error);
    }
  };
  
  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => setIsModalOpen(true),
    },
    {
      key: "admin",
      icon: <SettingOutlined />,
      label: "Admin",
      onClick: () => navigate("/admin"),
    },
    ...(isAuthenticated 
      ? [{
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          onClick: handleLogout,
        }]
      : [{
          key: "/login",
          icon: <LoginOutlined />,
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        }]
    ),
  ];

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
        <SearchComponent onSearch={(value) => console.log("Search query:", value)} />
        <MessageDropdown />
        <Badge count={unreadNotifications.length} size="default">
          <NotificationDropdown
            notifications={notifications}
            isLoading={isNotificationLoading}
          />
        </Badge>
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["hover"]}
          overlayStyle={{ width: "200px" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <Avatar
              size={48}
              icon={isAvatarLoading ? <Spin /> : <UserOutlined style={{ fontSize: '24px' }} />}
              src={!isAvatarLoading ? imageUrl : undefined}
              className="hover:opacity-80 transition-opacity border-2 border-[var(--text-primary)]"
            />
          </motion.div>
        </Dropdown>
      </Space>

      <Profile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Space>
  );
};

export default CustomHeader;