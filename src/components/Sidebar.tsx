import React, { useMemo } from "react";
import { Menu, Image, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/login/logo-ptit.png'
import {
  CarryOutOutlined,
  DashboardOutlined,
  HomeOutlined,
  ContactsOutlined,
  DatabaseOutlined,
  FormOutlined,
} from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const { Title } = Typography;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    NProgress.start();
    setTimeout(() => {
      navigate(path);
      NProgress.done();
    }, 300);
  };

  const menuItems = useMemo((): MenuItem[] => [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      path: "/",
    },
    {
      key: "/practice",
      icon: <CarryOutOutlined />,
      label: "Thực hành",
      path: "/practice",
    },
    {
      key: "/exam",
      icon: <FormOutlined />,
      label: "Kiểm tra",
      path: "/exam",
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
      key: "/report-history",
      icon: <ContactsOutlined />,
      label: "Báo cáo",
      path: "/report-history",
    },
    {
      key: "/contact",
      icon: <ContactsOutlined />,
      label: "Liên hệ",
      path: "/contact",
    },
    // {
    //   key: "/setting",
    //   icon: <SettingOutlined />,
    //   label: "Cài đặt",
    //   path: "/setting",
    // },
  ], []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4" style={{ paddingLeft: collapsed ? '1rem' : '1.5rem' }}>
        <div className="flex items-center gap-3">
          <Image 
            src={logo} 
            alt="PTIT Logo" 
            preview={false}
            width={40}
            className="min-w-[40px]"
          />
          <div className="overflow-hidden" style={{ width: collapsed ? 0 : 'auto', transition: 'width 0.3s ease-in-out' }}>
            <Title level={5} className="m-0 text-[#4F6F52] whitespace-nowrap">
              IoT Lab PTIT
            </Title>
          </div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="flex-1 border-0 mt-4"
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => handleMenuClick(item.path),
        }))}
      />

      <style>{`
        .ant-menu-item {
          margin: 4px 8px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        .ant-menu-item:hover {
          background-color: rgba(79, 111, 82, 0.1) !important;
          color: #4F6F52 !important;
        }
        .ant-menu-item-selected {
          background-color: #4F6F52 !important;
          color: white !important;
        }
        .ant-menu-item-selected span {
          color: white !important;
        }
        .ant-menu-inline {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;