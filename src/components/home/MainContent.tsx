// components/home/MainContent.tsx
import React from 'react';
import { Typography, Card, Statistic, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { RocketOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const MainContent: React.FC = () => {
  return (
    <motion.div
      className="flex-1 space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/90 backdrop-blur">
        <Title level={2} className="text-[#4f6f52]">
          Chào mừng đến với IoT LAB
        </Title>
        <Paragraph className="text-lg text-[#3a5a40]">
          Tiên phong tương lai thông qua các giải pháp IoT sáng tạo và nghiên cứu trong lĩnh vực
          Internet of Things. 
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        {[
          { icon: <RocketOutlined />, title: "Dự án", value: 50 },
          { icon: <ExperimentOutlined />, title: "Ngiên cứu", value: 25 },
          { icon: <TeamOutlined />, title: "Thành viên", value: 30 },
        ].map((stat, index) => (
          <Col span={8} key={index}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="text-center bg-white/90 backdrop-blur">
                <div className="text-3xl text-[#4f6f52] mb-2">{stat.icon}</div>
                <Statistic title={stat.title} value={stat.value} />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default MainContent;