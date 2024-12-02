import React, { useState } from "react";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "./App.css";
import CustomHeader from "./components/Header";
import MainContent from "./components/MainContent";
import SideContent from "./components/SideContent";
import Sidebar from "./components/SideBar";

// Destructuring Layout components
const { Sider, Header, Content } = Layout;

const App: React.FC = () => {
  // Khai báo kiểu cho state `collapsed`
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar />
        
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger-btn"
        />
      </Sider>
      <Layout>
        <Header className="header">
          <CustomHeader />
        </Header>
        <Content className="content">
          <div style={{ display: "flex" }}>
            <MainContent />
            <SideContent />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
