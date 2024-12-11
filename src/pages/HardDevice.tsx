// pages/HardDevicePage.tsx
import React, { useState } from 'react';
import { Typography, Tabs } from 'antd';
import { DatabaseOutlined, HistoryOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { Device, DeviceFilterParams } from '../types/hardDevice';
import { useHardDevices } from '../hooks/useHardDevices';
import { HardDeviceFilters } from '../components/device/HardDeviceFilters';
import { HardDeviceGrid } from '../components/device/HardDeviceGrid';
import { BorrowModal } from '../components/device/BorrowModal';
import { LendingHistoryTable } from '../components/device/LendingHistoryTable';

const { Title } = Typography;

// Color theme constants
const COLORS = {
    primary: '#4f6f52',
    secondary: '#86a789',
    light: '#d2e3c8',
    background: 'from-[#d2e3c8] via-[#86a789] to-[#4f6f52]'
};

const HardDevicePage: React.FC = () => {
    const [filters, setFilters] = useState<DeviceFilterParams>({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [activeTab, setActiveTab] = useState('all');
    const [borrowModalVisible, setBorrowModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    const {
        useFilteredDevices,
        useDevicesBorrowedByUser,  // Add this
        useBorrowHistory,          // Add this
        borrowDevice,
        isBorrowing
    } = useHardDevices();

    // Queries
    const { data: devicesData, isLoading: isLoadingDevices } = useFilteredDevices(filters);
    const { data: borrowedDevicesData, isLoading: isLoadingBorrowed } = useDevicesBorrowedByUser(page, pageSize);
    const { data: borrowHistoryData, isLoading: isLoadingHistory } = useBorrowHistory(page, pageSize);

    const devices = devicesData?.data || [];
    const borrowedDevices = borrowedDevicesData?.data || [];
    const borrowRecords = borrowHistoryData?.data || [];

    // Format createdAt date
    const formatDate = (dateArray: number[] | undefined) => {
        if (!dateArray) return undefined;
        return new Date(
            dateArray[0],
            dateArray[1] - 1,
            dateArray[2],
            dateArray[3],
            dateArray[4],
            dateArray[5]
        ).toLocaleString();
    };

    const handleBorrow = (device: Device) => {
        setSelectedDevice(device);
        setBorrowModalVisible(true);
    };

    const handleBorrowSubmit = async (values: { notes?: string; expiredAt: string }) => {
        if (!selectedDevice) return;

        try {
            await borrowDevice({
                deviceId: selectedDevice.id,
                note: values.notes ?? '',
                expiredAt: values.expiredAt
            });
            setBorrowModalVisible(false);
        } catch {
            // Error handling is managed by the mutation
        }
    };

    // Update devices with formatted dates
    const formattedDevices: Device[] = devices.map((device: Device) => ({
        ...device,
        createdAt: formatDate(device.createdAt as unknown as number[]) || '',
        updatedAt: device.updatedAt ? formatDate(device.updatedAt as unknown as number[]) : undefined
    }));

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage - 1);
        setPageSize(newPageSize);
    };

    return (
        <AppLayout>
            <div className={`min-h-screen bg-gradient-to-br ${COLORS.background}`}>
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <motion.div
                        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title level={2} className={`text-[${COLORS.primary}] flex items-center gap-3 m-0`}>
                            <DatabaseOutlined className="text-2xl" />
                            Hardware Devices Management
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
                                <h3 className={`text-lg font-semibold mb-4 text-[${COLORS.primary}]`}>
                                    Filters
                                </h3>
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
                                                        devices={formattedDevices}
                                                        loading={isLoadingDevices}
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
                                                    <span className={`px-2 py-0.5 text-sm bg-[${COLORS.primary}]/10 text-[${COLORS.primary}] rounded-full`}>
                                                        {borrowedDevices.length}
                                                    </span>
                                                </span>
                                            ),
                                            children: (
                                                <div className="py-6">
                                                    <HardDeviceGrid
                                                        devices={borrowedDevices}
                                                        loading={isLoadingBorrowed}
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
                                                        borrowRecords={borrowRecords}
                                                        devices={devices}
                                                        loading={isLoadingHistory}
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

                <BorrowModal
                    visible={borrowModalVisible}
                    device={selectedDevice}
                    onCancel={() => setBorrowModalVisible(false)}
                    onSubmit={handleBorrowSubmit}
                    loading={isBorrowing}
                />
            </div>
        </AppLayout>
    );
};

export default HardDevicePage;