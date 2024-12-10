// pages/HardDevicePage.tsx
import React, { useState } from 'react';
import { Typography, Tabs, message } from 'antd';
import { DatabaseOutlined, HistoryOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { FilterParams, HardDevice, BorrowFormData } from '../types/hardDevice';
import { useHardDevices } from '../hooks/useHardDevices';
import { HardDeviceFilters } from '../components/device/HardDeviceFilters';
import { HardDeviceGrid } from '../components/device/HardDeviceGrid';
import { BorrowModal } from '../components/device/BorrowModal';
import { LendingHistoryTable } from '../components/device/LendingHistoryTable';
import { lendingHistory } from '../mocks/lendingHistoryData';

const { Title } = Typography;
const { TabPane } = Tabs;

const HardDevicePage: React.FC = () => {
    const [filters, setFilters] = useState<FilterParams>({});
    const [activeTab, setActiveTab] = useState('all');
    const [borrowModalVisible, setBorrowModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<HardDevice | null>(null);
    const [borrowLoading, setBorrowLoading] = useState(false);

    const { devices, loading } = useHardDevices(filters);

    const availableDevices = devices.filter(d => d.status === 'available');
    const borrowedDevices = devices.filter(d => d.status === 'borrowed');

    const handleBorrow = (device: HardDevice) => {
        setSelectedDevice(device);
        setBorrowModalVisible(true);
    };

    const handleBorrowSubmit = async (values: BorrowFormData) => {
        setBorrowLoading(true);
        try {
            // Implement API call here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            message.success(`Successfully borrowed ${selectedDevice?.name}`);
            setBorrowModalVisible(false);
            // Refresh devices list
        } catch (error) {
            message.error('Failed to borrow device');
        } finally {
            setBorrowLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52]">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <motion.div
                        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title level={2} className="text-primary flex items-center gap-3 m-0">
                            <DatabaseOutlined className="text-2xl" />
                            <span>Hardware Devices Management</span>
                        </Title>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <motion.div
                            className="lg:w-72 flex-shrink-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-primary">Filters</h3>
                                <HardDeviceFilters
                                    filters={filters}
                                    onFilterChange={setFilters}
                                />
                            </div>
                        </motion.div>

                        {/* Content Area */}
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                                <Tabs
                                    activeKey={activeTab}
                                    onChange={setActiveTab}
                                    className="px-6 pt-4"
                                    items={[
                                        {
                                            key: 'all',
                                            label: 'All Devices',
                                            children: (
                                                <div className="py-6">
                                                    <HardDeviceGrid
                                                        devices={devices}
                                                        loading={loading}
                                                        onBorrow={handleBorrow}
                                                    />
                                                </div>
                                            )
                                        },
                                        {
                                            key: 'borrowed',
                                            label: (
                                                <span className="flex items-center gap-2">
                                                    Borrowed Devices
                                                    <span className="px-2 py-0.5 text-sm bg-primary/10 text-primary rounded-full">
                                                        {borrowedDevices.length}
                                                    </span>
                                                </span>
                                            ),
                                            children: (
                                                <div className="py-6">
                                                    <HardDeviceGrid
                                                        devices={borrowedDevices}
                                                        loading={loading}
                                                        onBorrow={handleBorrow}
                                                    />
                                                </div>
                                            )
                                        },
                                        {
                                            key: 'history',
                                            label: (
                                                <span className="flex items-center gap-2">
                                                    <HistoryOutlined />
                                                    Lending History
                                                </span>
                                            ),
                                            children: (
                                                <div className="py-6">
                                                    <LendingHistoryTable
                                                        lendingHistory={lendingHistory}
                                                        devices={devices}
                                                    />
                                                </div>
                                            )
                                        }
                                    ]}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Enhanced Borrow Modal */}
                <BorrowModal
                    visible={borrowModalVisible}
                    device={selectedDevice}
                    onCancel={() => setBorrowModalVisible(false)}
                    onSubmit={handleBorrowSubmit}
                    loading={borrowLoading}
                />
            </div>
        </AppLayout>
    );
};

export default HardDevicePage;