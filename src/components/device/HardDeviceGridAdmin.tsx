import React from 'react';
import { Empty, Card, Skeleton } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDeviceCardAdmin } from './HardDeviceCardAdmin';
import { Device } from '../../types/hardDevice';

interface Props {
    devices: Device[];
    loading: boolean;
    onBorrow: (device: Device) => void;
    error?: Error;
}

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((key) => (
            <Card key={key} className="w-full">
                <Skeleton.Image className="w-full h-48" active />
                <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
        ))}
    </div>
);

export const HardDeviceGridAdmin: React.FC<Props> = ({
    devices,
    loading,
    onBorrow,
    error
}) => {
    if (error) {
        return (
            <Empty
                description="Error loading devices"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!devices?.length) {
        return (
            <Empty
                description="No devices found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {devices.map((device, index) => (
                    <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            delay: index * 0.05,
                            duration: 0.2
                        }}
                    >
                        <HardDeviceCardAdmin
                            device={device}
                            onBorrow={onBorrow}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};