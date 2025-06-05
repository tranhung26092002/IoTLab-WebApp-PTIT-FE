import React, { useState } from "react";
import { Avatar, Space, Typography, Spin, Badge, Dropdown, Tooltip } from "antd";
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  LoginOutlined, 
  BellOutlined, 
  MessageOutlined,
  HomeOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Profile from "../../pages/Profile";
import { motion, AnimatePresence } from "framer-motion";
import { MessageDropdown, MessageTooltipContent } from "./MessageDropdown";
import { NotificationDropdown, NotificationTooltipContent } from "./NotificationDropdown";
import { SearchComponent } from "./SearchBar";
import { useAvatar } from "../../hooks/useAvatar";
import { useUsers } from "../../hooks/useUsers";
import { useNotification } from "../../hooks/useNotification";
import { useChat } from "../../hooks/useChat";
import type { MenuProps } from "antd";
import { useAuth } from "../../hooks/useAuth";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const { Title, Text } = Typography;

interface HeaderProps {
  layoutType?: 'admin' | 'user';
}

const CustomHeader: React.FC<HeaderProps> = ({ layoutType = 'user' }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me } = useUsers({ enableMe: true });
  const { imageUrl, isLoading: isAvatarLoading } = useAvatar(me?.avatarUrl);
  const { notifications, isLoading: isNotificationLoading } = useNotification(me?.id || 0);
  const { messages } = useChat();
  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = messages.filter(msg => !msg.isUser && !msg.read).length;
  const { isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    NProgress.start();
    try {
      await signOut();
      navigate('/login'); 
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
      label: "Hồ sơ người dùng",
      onClick: () => setIsModalOpen(true),
    },
    ...(layoutType === 'user' 
      ? [{
          key: "admin",
          icon: <SettingOutlined />,
          label: "Quản trị hệ thống",
          onClick: () => navigate("/admin"),
        }]
      : [{
          key: "user",
          icon: <HomeOutlined />,
          label: "Trang người dùng",
          onClick: () => navigate("/"),
        }]
    ),
    ...(isAuthenticated 
      ? [{
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          onClick: handleLogout,
          danger: true,
        }]
      : [{
          key: "/login",
          icon: <LoginOutlined />,
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        }]
    ),
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="px-8 py-4 flex items-center justify-between bg-gradient-to-r from-[#f8faf6] via-white to-[#f8faf6]"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left section - Title and Subtitle */}
      <motion.div variants={itemVariants}>
        <Title
          level={1}
          className="!m-0 !text-[#1a1a1a]"
          style={{
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginBottom: '4px'
          }}
        >
          NỀN TẢNG THỰC HÀNH SỐ IoT
        </Title>
        <Text className="text-[#4a4a4a] font-medium">
          Học tập - Thực hành - Đổi mới
        </Text>
      </motion.div>

      {/* Right section - Search & Controls */}
      <Space align="center" size={32} className="mr-8">
        <motion.div variants={itemVariants} className="w-64">
          <SearchComponent 
            onSearch={(value) => console.log('Search query:', value)} 
          />
        </motion.div>

        <motion.div variants={itemVariants} className="ml-4">
          <Tooltip 
            title={<MessageTooltipContent />}
            placement="bottom"
            overlayClassName="!p-0"
            overlayInnerStyle={{
              background: 'linear-gradient(to right, #4f6f52, #3d5740)',
              borderRadius: '12px',
            }}
          >
            <Badge 
              count={unreadCount} 
              offset={[-5, 5]}
              size="small"
              className="cursor-pointer"
            >
              <div className="inline-block">
                <MessageDropdown>
                  <MessageOutlined className="text-xl p-2 rounded-full bg-[#d2e3c8] text-[#4F6F52] hover:bg-[#86A789] hover:text-white transition-all duration-300" />
                </MessageDropdown>
              </div>
            </Badge>
          </Tooltip>
        </motion.div>

        <motion.div variants={itemVariants} className="ml-4">
          <Tooltip 
            title={<NotificationTooltipContent />}
            placement="bottom"
            overlayClassName="!p-0"
            overlayInnerStyle={{
              background: 'linear-gradient(to right, #4f6f52, #3d5740)',
              borderRadius: '12px',
            }}
          >
            <Badge 
              count={unreadNotifications.length} 
              offset={[-5, 5]}
              size="small"
              className="cursor-pointer"
            >
              <NotificationDropdown
                notifications={notifications}
                isLoading={isNotificationLoading}
              >
                <BellOutlined className="text-xl p-2 rounded-full bg-[#d2e3c8] text-[#4F6F52] hover:bg-[#86A789] hover:text-white transition-all duration-300" />
              </NotificationDropdown>
            </Badge>
          </Tooltip>
        </motion.div>

        <motion.div variants={itemVariants} className="ml-4">
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['hover']}
            overlayStyle={{ 
              width: '200px',
              padding: '8px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Avatar
                size={40}
                icon={isAvatarLoading ? <Spin /> : <UserOutlined style={{ fontSize: '20px' }} />}
                src={!isAvatarLoading ? imageUrl : undefined}
                className="border-2 border-[#4F6F52] transition-all duration-300 hover:border-opacity-80 shadow-md"
              />
            </motion.div>
          </Dropdown>
        </motion.div>
      </Space>

      <AnimatePresence>
        {isModalOpen && (
          <Profile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomHeader;