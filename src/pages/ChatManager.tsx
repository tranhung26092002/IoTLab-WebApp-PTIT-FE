import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Spin, Result, Button } from 'antd';
import { FileOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DocumentManagement from '../components/chatAdmin/DocumentManagement';
import UserManagement from '../components/chatAdmin/UserManagement';
import SystemSettings from '../components/chatAdmin/SystemSettings';
import AppLayoutAdmin from '../components/AppLayoutAdmin';
import { useAdminAuth } from '../hooks/useAdminAuth';

const { Title } = Typography;
const { Content } = Layout;

const ChatManager: React.FC = () => {
    const [activeKey, setActiveKey] = useState('1');
    const { isAdmin, isLoading } = useAdminAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            navigate('/');
        }
    }, [isAdmin, isLoading, navigate]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Quay lại trang chủ
                    </Button>
                }
            />
        );
    }

    return (
        <AppLayoutAdmin>
            <Content className="p-6">
                <div className="mb-6">
                    <Title level={2} className="text-blue-800 m-0">
                        Quản lý Chat
                    </Title>
                </div>

                <Tabs
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    type="card"
                    items={[
                        {
                            key: '1',
                            label: (
                                <span>
                                    <FileOutlined />
                                    Quản lý tài liệu
                                </span>
                            ),
                            children: <DocumentManagement />
                        },
                        {
                            key: '2',
                            label: (
                                <span>
                                    <UserOutlined />
                                    Quản lý người dùng
                                </span>
                            ),
                            children: <UserManagement />
                        },
                        {
                            key: '3',
                            label: (
                                <span>
                                    <SettingOutlined />
                                    Cài đặt hệ thống
                                </span>
                            ),
                            children: <SystemSettings />
                        }
                    ]}
                />
            </Content>
        </AppLayoutAdmin>
    );
};

export default ChatManager;