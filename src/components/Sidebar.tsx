import React from "react";
import { Menu } from "antd";
import { FaLeaf } from "react-icons/fa6";
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  CarryOutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
// import { MenuProps } from "antd/es/menu";

// Định nghĩa kiểu cho các mục Menu
interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

const Sidebar: React.FC = () => {
  // Danh sách các item của menu
  const menuItems: MenuItem[] = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <CarryOutOutlined />,
      label: "My Orders",
    },
    {
      key: "3",
      icon: <OrderedListOutlined />,
      label: "ToDo",
    },
    {
      key: "4",
      icon: <ProfileOutlined />,
      label: "Profile",
    },
    {
      key: "5",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "6",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="logo">
          <FaLeaf />
        </div>
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="menu-bar"
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
      />
    </>
  );
};

export default Sidebar;
