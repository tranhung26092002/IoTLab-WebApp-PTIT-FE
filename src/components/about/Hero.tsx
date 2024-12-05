import React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export const Hero: React.FC = () => (
    <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        <Title level={1} className="forest--dark--color mb-6">
            Innovation Through Research
        </Title>
        <Paragraph className="text-xl moss--color max-w-2xl mx-auto">
            Pioneering the future through cutting-edge technology and sustainable solutions
        </Paragraph>
    </motion.div>
);
