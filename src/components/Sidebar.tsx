import React from "react";
import { Menu, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import Link
import logo from '../assets/login/logo-ptit.png'
import {
  UserOutlined,
  LoginOutlined,
  OrderedListOutlined,
  CarryOutOutlined,
  SettingOutlined,
  HomeOutlined,
  ContactsOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const Sidebar: React.FC = () => {
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
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "/about",
      icon: <UserOutlined />,
      label: "About",
      path: "/about",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "/course",
      icon: <CarryOutOutlined />,
      label: "My Courses",
      path: "/course",
    },
    {
      key: "/task",
      icon: <OrderedListOutlined />,
      label: "Tasks",
      path: "/task",
    },
    {
      key: "/contact",
      icon: <ContactsOutlined />,
      label: "Contact",
      path: "/contact",
    },
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: "Setting",
      path: "/setting",
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

export default Sidebar;
