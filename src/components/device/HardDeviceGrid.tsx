import React from 'react';
import { Empty, Spin } from 'antd';
import { motion } from 'framer-motion';
import { HardDeviceCard } from './HardDeviceCard';
import { HardDevice } from '../../types/hardDevice';

interface Props {
    devices: HardDevice[];
    loading: boolean;
    onBorrow: (device: HardDevice) => void;
}

export const HardDeviceGrid: React.FC<Props> = ({ devices, loading, onBorrow }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (devices.length === 0) {
        return <Empty description="No devices found" />;
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {devices.map((device, index) => (
                <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <HardDeviceCard device={device} onLend={onBorrow} />
                </motion.div>
            ))}
        </motion.div>
    );
};