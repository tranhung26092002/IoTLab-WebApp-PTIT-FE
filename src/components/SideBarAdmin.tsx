import React from "react";
import { Menu, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import Link
import logo from '../assets/login/logo-ptit.png'
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  DatabaseOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;  // onClick là tùy chọn
};

const SidebarAdmin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    NProgress.start();
    setTimeout(() => {
      navigate(path);
      NProgress.done();
    }, 300);
  };

  // Danh sách các item của menu
  const getBaseMenuItems = (): MenuItem[] => [
    {
      key: "/admin",
      icon: <HomeOutlined />,
      label: "Tổng quan",
      path: "/admin",
    },
    {
      key: "/admin/chat-manager",
      icon: <BookOutlined />,
      label: "Chat",
      path: "/admin/chat-manager",
    },
    {
      key: "/admin/user-manager",
      icon: <UserOutlined />,
      label: "Người dùng",
      path: "/admin/user-manager",
    },
    {
      key: "/admin/practice-manager",
      icon: <BookOutlined />,
      label: "Bài thực hành",
      path: "/admin/practice-manager",
    },
    {
      key: "/admin/report-manager",
      icon: <ContactsOutlined />,
      label: "Báo cáo",
      path: "/admin/report-manager",
    },
    {
      key: "/admin/device-manager",
      icon: <DatabaseOutlined />,
      label: "Thiết bị",
      path: "/admin/device-manager",
    },
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      path: "/",
    },
  ];

  const menuItems = getBaseMenuItems();

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="logo w-16 h-16">
          <Image src={logo} alt="Logo" />
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="menu-bar"
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: item.onClick,
        }))}
        onClick={({ key }) => {
          const item = menuItems.find(item => item.key === key);
          if (item?.path) {
            handleMenuClick(item.path);
          } else if (item?.onClick) {
            item.onClick();  // Gọi onClick nếu tồn tại
          }
        }}
      />
    </>
  );
};

export default SidebarAdmin;
