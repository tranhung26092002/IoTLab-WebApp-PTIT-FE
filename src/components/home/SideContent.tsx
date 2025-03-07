// components/home/SideContent.tsx
import React from 'react';
import { Card, Typography, Timeline, Tag } from 'antd';
import { motion } from 'framer-motion';
import { ClockCircleOutlined, BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SideContent: React.FC = () => {
  return (
    <motion.div
      className="w-[350px] space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/90 backdrop-blur">
        <Title level={4} className="text-[#4f6f52]">
          Upcoming Events
        </Title>
        <Timeline
          items={[
            {
              dot: <ClockCircleOutlined className="text-[#4f6f52]" />,
              children: (
                <>
                  <div className="font-medium">IoT Workshop</div>
                  <div className="text-sm text-gray-500">Tomorrow, 2:00 PM</div>
                </>
              ),
            },
            {
              dot: <BellOutlined className="text-[#4f6f52]" />,
              children: (
                <>
                  <div className="font-medium">Research Presentation</div>
                  <div className="text-sm text-gray-500">Next Week</div>
                </>
              ),
            },
          ]}
        />
      </Card>

      <Card className="bg-white/90 backdrop-blur">
        <Title level={4} className="text-[#4f6f52]">
          Technologies
        </Title>
        <div className="flex flex-wrap gap-2">
          {[
            "Arduino",
            "Raspberry Pi",
            "LoRaWAN",
            "MQTT",
            "Node.js",
            "Python",
            "AWS IoT",
            "Sensors"
          ].map((tech, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Tag color="green">{tech}</Tag>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* <Card className="bg-white/90 backdrop-blur">
        <Title level={4} className="text-[#4f6f52]">
          Quick Links
        </Title>
        <div className="space-y-2">
          {[
            "Research Papers",
            "Team Members",
            "Lab Resources",
            "Contact Us"
          ].map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-2 bg-[#d2e3c8] rounded cursor-pointer hover:bg-[#86a789] transition-colors"
            >
              {link}
            </motion.div>
          ))}
        </div>
      </Card> */}
    </motion.div>
  );
};

export default SideContent;