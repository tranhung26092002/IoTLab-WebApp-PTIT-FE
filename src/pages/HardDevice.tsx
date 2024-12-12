import React, { useState } from 'react';
import { Typography, Tabs, Pagination } from 'antd';
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
    const [activeTab, setActiveTab] = useState('all');
    const [borrowModalVisible, setBorrowModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [borrowedCurrentPage, setBorrowedCurrentPage] = useState(1);
    const [borrowedPageSize, setBorrowedPageSize] = useState(8);

    const {
        useFilteredDevices,
        useDevicesBorrowedByUser,  // Add this
        useBorrowHistoryByUser,          // Add this
        borrowDevice,
        isBorrowing
    } = useHardDevices();

    const {
        devices,
        isLoading,
        metadata,
        handlePageChange,
        handleSizeChange
    } = useFilteredDevices({
        ...filters,
        page: currentPage - 1, // Convert to 0-based for API
        size: pageSize
    });


    const {
        data: borrowedDevicesData,
        isLoading: isLoadingBorrowed
    } = useDevicesBorrowedByUser(borrowedCurrentPage - 1, borrowedPageSize);

    const { data: borrowHistoryData, isLoading: isLoadingHistory } = useBorrowHistoryByUser();

    // const devices = devicesData?.data || [];

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
    const formattedDevices = devices.map(device => ({
        ...device,
        createdAt: formatDate(device.createdAt as unknown as number[]) || '',
        updatedAt: device.updatedAt ? formatDate(device.updatedAt as unknown as number[]) : undefined
    }));

    const onPaginationChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        handlePageChange(page - 1); // Convert to 0-based for API
        handleSizeChange(size);
    };

    const onBorrowedPaginationChange = (page: number, size: number) => {
        setBorrowedCurrentPage(page);
        setBorrowedPageSize(size);
    };

    return (
        <AppLayout>
            <div className={`min-h-screen bg-gradient-to-br ${COLORS.background}`}>
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section with Title and Filters */}
                    <motion.div
                        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title level={2} className={`text-[${COLORS.primary}] flex items-center gap-3 mb-6`}>
                            <DatabaseOutlined className="text-2xl" />
                            Hardware Devices
                        </Title>

                        {/* Filters Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <HardDeviceFilters
                                filters={filters}
                                onFilterChange={setFilters}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
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
                                                loading={isLoading}
                                                onBorrow={handleBorrow}
                                            />
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={metadata?.total || 0}
                                                showTotal={(total) => `Total ${total} records`}
                                                showSizeChanger
                                                onChange={onPaginationChange}
                                                className="mt-4 text-right"
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
                                                {borrowedDevicesData?.metadata?.total || 0}
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
                                            <Pagination
                                                current={borrowedCurrentPage}
                                                pageSize={borrowedPageSize}
                                                total={borrowedDevicesData?.metadata?.total || 0}
                                                showTotal={(total) => `Total ${total} records`}
                                                showSizeChanger
                                                onChange={onBorrowedPaginationChange}
                                                className="mt-4 text-right"
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
                    </motion.div>
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