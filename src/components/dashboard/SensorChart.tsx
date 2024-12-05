// src/components/dashboard/SensorChart.tsx
import React from 'react';
import { Card, Space } from 'antd';
import { Line } from '@ant-design/plots';
import { motion } from 'framer-motion';
import { Sensor, ChartConfig } from '../../types/dashboard';

interface SensorChartProps {
    sensor: Sensor;
    index: number;
    chartConfig: ChartConfig;
}

export const SensorChart: React.FC<SensorChartProps> = ({ sensor, index, chartConfig }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
        >
            <Card
                title={
                    <Space>
                        <span>{sensor.icon}</span>
                        <span style={{ color: sensor.color }}>{sensor.title} Monitoring</span>
                    </Space>
                }
                className="shadow-md hover:shadow-xl transition-all duration-300"
                style={{ borderColor: sensor.color }}
            >
                <div className="h-[300px]">
                    <Line {...chartConfig} />
                </div>
            </Card>
        </motion.div>
    );
};