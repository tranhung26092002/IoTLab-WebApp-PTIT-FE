import React from "react";
import { Menu, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import Link
import logo from '../assets/login/logo-ptit.png'
import {
  UserOutlined,
  LoginOutlined,
  OrderedListOutlined,
  SettingOutlined,
  HomeOutlined,
  DashboardOutlined,
  BookOutlined,
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const SidebarAdmin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    // Start loading animation
    NProgress.start();

    // Add small delay for visual feedback
    setTimeout(() => {
      navigate(path);
      // Complete loading animation after navigation
      NProgress.done();
    }, 300);
  };

  // Danh sách các item của menu
  const menuItems = [
    {
      key: "/admin",
      icon: <HomeOutlined />,
      label: "Overview",
      path: "/admin",
    },
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      key: "/admin/user",
      icon: <UserOutlined />,
      label: "User Management",
      path: "/admin/user-manager",
    },
    {
      key: "/admin/task",
      icon: <OrderedListOutlined />,
      label: "Task Management",
      path: "/admin/task-manager",
    },
    {
      key: "/admin/course",
      icon: <BookOutlined />,
      label: "Course Management",
      path: "/admin/course-manager",
    },
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: "Setting",
      path: "/setting",
    },
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "/login",
      icon: <LoginOutlined />,
      label: "Login",
      path: "/login",
    },
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
        }))}
        onClick={({ key }) => {
          const item = menuItems.find(item => item.key === key);
          if (item) {
            handleMenuClick(item.path);
          }
        }}
      />
    </>
  );
};

export default SidebarAdmin;
