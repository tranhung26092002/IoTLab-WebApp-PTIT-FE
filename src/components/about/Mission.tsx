// src/components/about/Mission.tsx
import React from 'react';
import { Card, Typography } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { animations, colors } from '../../constants/aboutConstants';

const { Title, Paragraph } = Typography;

export const Mission: React.FC = () => (
    <motion.div
        className="mb-16"
        {...animations.fadeInUp}
    >
        <Title level={2} className="flex items-center gap-3 primary--light--color mb-6">
            <ExperimentOutlined className="text-2xl" />
            Our Mission
        </Title>
        <motion.div {...animations.cardHover}>
            <Card
                className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#f5f8f5]"
                style={{ borderColor: colors.accent }}
            >
                <Paragraph className="text-lg moss--color leading-relaxed">
                    We are dedicated to advancing scientific research through cutting-edge technology
                    and innovative methodologies. Our laboratory focuses on pioneering research
                    in environmental sustainability and biotechnology.
                </Paragraph>
            </Card>
        </motion.div>
    </motion.div>
);