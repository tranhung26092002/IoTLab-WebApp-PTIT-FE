import React from 'react';
import { Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { DashboardOutlined } from '@ant-design/icons';
import { useDashboard } from '../hooks/useDashboard';
import { DeviceCardDashboard } from '../components/dashboard/DeviceCardDashboard';
import AppLayout from '../components/AppLayout';

const Dashboard: React.FC = () => {
    const { devices, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-[80vh]">
                    <Spin size="large" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="p-6 space-y-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52] min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography.Title level={2} className="flex items-center gap-2 text-[#2c4a2d]">
                        <DashboardOutlined /> IoT Devices Dashboard
                    </Typography.Title>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {devices?.data.map((device, index) => (
                        <motion.div
                            key={device.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <DeviceCardDashboard device={device} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;