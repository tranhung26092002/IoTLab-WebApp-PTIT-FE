import React, { useState } from 'react';
import { Typography, Tabs, Pagination, Button } from 'antd';
import { DatabaseOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Device, DeviceFilterParams } from '../types/hardDevice';
import { useHardDevices } from '../hooks/useHardDevices';
import { HardDeviceFilters } from '../components/device/HardDeviceFilters';
import { BorrowModal } from '../components/device/BorrowModal';
import AppLayoutAdmin from '../components/AppLayoutAdmin';
import { HardDeviceGridAdmin } from '../components/device/HardDeviceGridAdmin';
import { LendingHistoryTableAdmin } from '../components/device/LendingHistoryTableAdmin';
import { CreateDeviceModal } from '../components/device/CreateDeviceModal';

const { Title } = Typography;

// Color theme constants
const COLORS = {
  primary: '#4f6f52',
  secondary: '#86a789',
  light: '#d2e3c8',
  background: 'from-[#d2e3c8] via-[#86a789] to-[#4f6f52]'
};

const HardDeviceManager: React.FC = () => {
  const [filters, setFilters] = useState<DeviceFilterParams>({});
  const [activeTab, setActiveTab] = useState('all');
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { createDevice, isCreating } = useHardDevices();

  const {
    useFilteredDevices,
    useBorrowHistory,          // Add this
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

  const { data: borrowHistoryData, isLoading: isLoadingHistory } = useBorrowHistory();

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

  const handleCreateDevice = async (values: Partial<Device>, file?: File) => {
    try {
      await createDevice({ device: values, file });
      setCreateModalVisible(false);
    } catch (error) {
      console.error('Failed to create device:', error);
    }
  };

  return (
    <AppLayoutAdmin>
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.background}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header Section with Title and Filters */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <Title level={2} className={`text-[${COLORS.primary}] flex items-center gap-3 mb-6`}>
                <DatabaseOutlined className="text-2xl" />
                Hardware Devices Manager
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Create Device
              </Button>
            </div>

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
                      <HardDeviceGridAdmin
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
                  key: 'history',
                  label: (
                    <span className="flex items-center gap-2">
                      <HistoryOutlined />
                      Lending History
                    </span>
                  ),
                  children: (
                    <div className="py-6">
                      <LendingHistoryTableAdmin
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

        <CreateDeviceModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSubmit={handleCreateDevice}
          isLoading={isCreating}
        />
      </div>
    </AppLayoutAdmin>
  );
};

export default HardDeviceManager;