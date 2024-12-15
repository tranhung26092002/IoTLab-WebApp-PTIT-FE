import React from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

interface SensorChartProps {
    name: string;
    data: Array<{ time: string; value: number }>;
    index: number;
    color: string;
}

export const SensorChart: React.FC<SensorChartProps> = ({
    name, data, index, color
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="w-full p-2"
        >
            <Card
                title={name.charAt(0).toUpperCase() + name.slice(1)}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                bordered={false}
            >
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </motion.div>
    );
};