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
          Welcome to IoT Lab PTIT
        </Title>
        <Paragraph className="text-lg text-[#3a5a40]">
          Pioneering the future through innovative IoT solutions and research
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        {[
          { icon: <RocketOutlined />, title: "Projects", value: 50 },
          { icon: <ExperimentOutlined />, title: "Research Papers", value: 25 },
          { icon: <TeamOutlined />, title: "Team Members", value: 30 },
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

      <Card className="bg-white/90 backdrop-blur">
        <Title level={3} className="text-[#4f6f52]">Latest Projects</Title>
        <div className="space-y-4">
          {[
            "Smart Agriculture Monitoring",
            "Industrial IoT Solutions",
            "Smart Campus Initiative"
          ].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-[#d2e3c8] rounded-lg"
            >
              {project}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default MainContent;