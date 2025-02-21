import React from "react";
import { Menu, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/login/logo-ptit.png'
import {
  CarryOutOutlined,
  SettingOutlined,
  DashboardOutlined,
  HomeOutlined,
  ContactsOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    NProgress.start();
    setTimeout(() => {
      navigate(path);
      NProgress.done();
    }, 300);
  };

  const getBaseMenuItems = (): MenuItem[] => [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      path: "/",
    },
    // {
    //   key: "/about",
    //   icon: <UserOutlined />,
    //   label: "Thông tin",
    //   path: "/about",
    // },
    {
      key: "/practice",
      icon: <CarryOutOutlined />,
      label: "Thực hành",
      path: "/practice",
    },
    {
      key: "/device",
      icon: <DatabaseOutlined />,
      label: "Quản lí thiết bị",
      path: "/device",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "/report",
      icon: <ContactsOutlined />,
      label: "Báo cáo",
      path: "/report",
    },
    {
      key: "/contact",
      icon: <ContactsOutlined />,
      label: "Liên lạc",
      path: "/contact",
    },
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      path: "/setting",
    },
  ];

  const menuItems = getBaseMenuItems();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center py-4">
        <div className="logo w-16 h-16">
          <Image src={logo} alt="Logo" />
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="menu-bar flex-1 overflow-y-auto"
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
            item.onClick();
          }
        }}
      />
    </div>
  );
};

export default Sidebar;