// src/components/about/Facilities.tsx
import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { facilities } from '../../data/aboutData';
import { animations, colors } from '../../constants/aboutConstants';

const { Title, Paragraph } = Typography;

export const Facilities: React.FC = () => (
  <motion.div
    {...animations.fadeInUp}
    className="mb-16"
  >
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Title level={2} className="flex items-center gap-3 primary--light--color mb-8">
          <SafetyCertificateOutlined className="text-2xl" />
          Our Facilities
        </Title>
      </Col>
      <motion.div
        className="w-full"
        variants={animations.stagger.container}
        initial="hidden"
        animate="show"
      >
        <Row gutter={[24, 24]}>
          {facilities.map((facility, index) => (
            <Col xs={24} md={8} key={index}>
              <motion.div
                variants={animations.stagger.item}
                {...animations.cardHover}
              >
                <Card
                  title={
                    <span className="forest--dark--color flex items-center gap-2 text-lg">
                      {facility.icon} {facility.title}
                    </span>
                  }
                  className={`h-full shadow-md hover:shadow-xl transition-all bg-gradient-to-br ${colors.gradient[facility.bgColor as keyof typeof colors.gradient]}`}
                  style={{ borderColor: colors.accent }}
                >
                  <Paragraph className="moss--color">
                    {facility.description}
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Row>
  </motion.div>
);

export default Facilities;