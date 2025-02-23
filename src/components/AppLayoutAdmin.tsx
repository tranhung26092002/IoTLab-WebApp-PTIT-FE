import React, { Suspense, useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../App.css";
import CustomFooter from "./Footer";
import CustomHeader from "./header/Header";
import LoadingSpinner from "./LoadingSpinner";
import SidebarAdmin from "./SideBarAdmin";

const { Sider, Header, Content } = Layout;

const AppLayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize collapsed state from localStorage
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Update localStorage when collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.3,
    });
    setIsLoading(false);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <motion.div
          initial={false}
          animate={{ width: collapsed ? 80 : 250 }}  // Changed from 200 to 250
          transition={{ duration: 0.2 }}
        >
          <SidebarAdmin />
        </motion.div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="triger-btn"
        />
      </Sider>
      <Layout>
        <Header className="header">
          <CustomHeader />
        </Header>
        <Content className="content">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {!isLoading && children}
              </motion.div>
            </Suspense>
          </AnimatePresence>
        </Content>
        <CustomFooter />
      </Layout>
    </Layout>
  );
};

export default AppLayoutAdmin;