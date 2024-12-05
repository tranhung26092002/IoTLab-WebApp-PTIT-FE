// src/components/dashboard/SensorCard.tsx
import React from 'react';
import { Card, Space, Statistic, Tooltip } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Sensor } from '../../types/dashboard';

interface SensorCardProps {
    sensor: Sensor;
    index: number;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card
                className="text-center hover:shadow-xl transition-all duration-300"
                style={{ borderColor: sensor.color }}
            >
                <Space direction="vertical" size="small" className="w-full">
                    <Statistic
                        title={
                            <span className="flex items-center justify-center gap-2 text-lg" style={{ color: sensor.color }}>
                                {sensor.icon} {sensor.title}
                            </span>
                        }
                        value={sensor.value}
                        valueStyle={{ color: sensor.color }}
                        suffix={
                            <Tooltip title={`Warning threshold: ${sensor.warning}${sensor.unit}`}>
                                <AlertOutlined
                                    className={Number(sensor.value.split(' ')[0]) > sensor.warning
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                    }
                                />
                            </Tooltip>
                        }
                    />
                </Space>
            </Card>
        </motion.div>
    );
};