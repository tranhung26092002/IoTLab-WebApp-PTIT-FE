import React, { Suspense, useState, useEffect, useCallback } from "react";
import { Layout, Button, ConfigProvider } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../App.css";
import CustomFooter from "./Footer";
import CustomHeader from "./header/Header";
import LoadingSpinner from "./LoadingSpinner";
import Sidebar from "./Sidebar";

const { Sider, Header, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.3,
    });
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '\\') {
        setCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleToggle = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F6F52',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <Layout className="min-h-screen">
        <Sider
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="fixed left-0 h-screen z-40 shadow-lg transition-all duration-300"
          width={250}
          collapsedWidth={80}
        >
          <div className="h-full flex flex-col">
            <Sidebar collapsed={collapsed} />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleToggle}
              className="absolute bottom-5 right-5 w-10 h-10 rounded-full shadow hover:shadow-md hover:bg-[#4F6F52] hover:text-white active:scale-95 transition-all duration-200 flex items-center justify-center"
              title={`${collapsed ? 'Mở rộng' : 'Thu gọn'} thanh bên (Ctrl + \\)`}
            />
          </div>
        </Sider>

        <Layout 
          className="transition-all duration-300"
          style={{ marginLeft: collapsed ? 80 : 250 }}
        >
          <Header className="bg-white shadow-sm p-0 sticky top-0 z-30">
            <CustomHeader layoutType="user" />
          </Header>

          <Content className="p-6 min-h-[calc(100vh-64px-69px)] bg-gray-50">
            <Suspense fallback={<LoadingSpinner />}>
              <div className="bg-white rounded-lg shadow-sm p-6">
                {children}
              </div>
            </Suspense>
          </Content>

          <CustomFooter />
        </Layout>
      </Layout>

      {/* Floating Scroll-to-Top Button */}
      <Button
        type="default"
        shape="circle"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 32,
          zIndex: 1100,
          background: '#fff',
          border: '2px solid #4f6f52',
          color: '#4f6f52',
          width: 36,
          height: 36,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          cursor: 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        className="exam-scrolltop-floating-btn"
        title="Lên đầu trang"
      >
        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="#4f6f52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </Button>
      <style>{`
        .exam-scrolltop-floating-btn:hover {
          background: #e6f4ea !important;
          box-shadow: 0 8px 24px rgba(79, 111, 82, 0.18) !important;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default AppLayout;