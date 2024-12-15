import React from 'react';
import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';

interface SensorMonitorCardProps {
    name: string;
    value: number;
    unit: string;
    warningThreshold: number;
    index: number;
    icon: React.ReactNode;
}

export const SensorMonitorCard: React.FC<SensorMonitorCardProps> = ({
    name, value, unit, warningThreshold, index, icon
}) => {
    const isWarning = value > warningThreshold;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full md:w-1/2 lg:w-1/4 p-2"
        >
            <Card
                className={`
          shadow-lg hover:shadow-xl transition-shadow duration-300
          ${isWarning ? 'bg-red-50' : 'bg-white'}
        `}
                bordered={false}
            >
                <div className="flex items-center justify-between">
                    <div className={`
            text-2xl
            ${isWarning ? 'text-red-500' : 'text-gray-600'}
          `}>
                        {icon}
                    </div>
                    <Typography.Text className="text-gray-500">{name}</Typography.Text>
                </div>

                <div className="mt-4">
                    <Typography.Title level={2} className={`
            mb-0
            ${isWarning ? 'text-red-500' : 'text-gray-700'}
          `}>
                        {value} {unit}
                    </Typography.Title>
                </div>
            </Card>
        </motion.div>
    );
};