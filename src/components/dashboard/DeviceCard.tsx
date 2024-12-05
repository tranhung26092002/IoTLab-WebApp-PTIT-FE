// src/components/dashboard/DeviceCard.tsx
import React from 'react';
import { Card, Switch, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Device } from '../../types/dashboard';

interface DeviceCardProps {
    device: Device;
    index: number;
    onToggle: (checked: boolean) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, index, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card
                className="hover:shadow-xl transition-all duration-300"
                style={{ borderColor: device.status ? '#4f6f52' : '#86a789' }}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className={`text-4xl ${device.status ? 'primary--color' : 'gray--color'}`}>
                        {device.icon}
                    </div>
                    <Typography.Title level={4} className="m-0 forest--dark--color">
                        {device.name}
                    </Typography.Title>
                    <Switch
                        checked={device.status}
                        onChange={onToggle}
                        className={device.status ? 'bg-[#4f6f52]' : ''}
                    />
                </div>
            </Card>
        </motion.div>
    );
};