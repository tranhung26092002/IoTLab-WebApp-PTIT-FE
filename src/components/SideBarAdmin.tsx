import React from "react";
import { Menu, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import Link
import logo from '../assets/login/logo-ptit.png'
import {
  UserOutlined,
  LoginOutlined,
  OrderedListOutlined,
  HomeOutlined,
  DashboardOutlined,
  BookOutlined,
  LogoutOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useAuth } from "../hooks/useAuth";

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
  const { isAuthenticated, signOut } = useAuth();

  const handleMenuClick = (path: string) => {
    NProgress.start();
    setTimeout(() => {
      navigate(path);
      NProgress.done();
    }, 300);
  };

  const handleLogout = async () => {
    NProgress.start(); // Bắt đầu thanh tiến trình

    try {
      await signOut(); // Thực hiện đăng xuất
      NProgress.done(); // Dừng thanh tiến trình khi đăng xuất thành công
      window.location.href = '/login';
    } catch (error) {
      NProgress.done(); // Dừng thanh tiến trình khi có lỗi
      console.error('Logout failed:', error);
    }
  };

  // Danh sách các item của menu
  const getAuthenticatedMenuItems = (): MenuItem[] => [
    {
      key: "/admin",
      icon: <HomeOutlined />,
      label: "Overview",
      path: "/admin",
    },
    {
      key: "/admin/user-manager",
      icon: <UserOutlined />,
      label: "User Management",
      path: "/admin/user-manager",
    },
    {
      key: "/admin/device-manager",
      icon: <DatabaseOutlined />,
      label: "Device Management",
      path: "/admin/device-manager",
    },
    {
      key: "/admin/practice-manager",
      icon: <BookOutlined />,
      label: "Practice Management",
      path: "/admin/practice-manager",
    },
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      key: "/admin/task-manager",
      icon: <OrderedListOutlined />,
      label: "Task Management",
      path: "/admin/task-manager",
    },
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const getLoginMenuItem = () => ({
    key: "/login",
    icon: <LoginOutlined />,
    label: "Login",
    path: "/login",
  });

  const menuItems: MenuItem[] = [
    ...(isAuthenticated ? getAuthenticatedMenuItems() : [getLoginMenuItem()]),
  ];

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
