import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { ApiOutlined, SendOutlined, FileTextOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface BrokerInfoCardProps {
  broker: string;
  topic: string;
  payload: string;
  index: number;
}

export const BrokerInfoCard: React.FC<BrokerInfoCardProps> = ({
  broker,
  topic,
  payload,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex items-center gap-2">
            <ApiOutlined className="text-xl text-[#722ed1]" />
            <Typography.Title level={5} className="m-0">
              Broker Information
            </Typography.Title>
          </div>

          <div className="space-y-4">
            <div>
              <Typography.Text type="secondary" className="block mb-1">
                <SendOutlined className="mr-2" />
                Broker URL
              </Typography.Text>
              <Tag color="purple" className="text-sm">
                {broker}
              </Tag>
            </div>

            <div>
              <Typography.Text type="secondary" className="block mb-1">
                <FileTextOutlined className="mr-2" />
                Topic
              </Typography.Text>
              <Tag color="blue" className="text-sm">
                {topic}
              </Tag>
            </div>

            <div>
              <Typography.Text type="secondary" className="block mb-1">
                <FileTextOutlined className="mr-2" />
                Latest Payload
              </Typography.Text>
              <div className="bg-gray-50 p-2 rounded">
                <Typography.Text code className="text-sm">
                  {payload}
                </Typography.Text>
              </div>
            </div>
          </div>
        </Space>
      </Card>
    </motion.div>
  );
}; 