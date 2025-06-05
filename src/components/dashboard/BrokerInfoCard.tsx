import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { 
  CloudServerOutlined, 
  MessageOutlined, 
  CodeOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface BrokerInfoCardProps {
  broker: string;
  topic: string;
  payload: string;
}

export const BrokerInfoCard: React.FC<BrokerInfoCardProps> = ({ broker, topic, payload }) => {
  const formatJson = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return jsonString;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 shadow-lg border border-green-100" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={4} className="mb-4 flex items-center">
        <CloudServerOutlined className="mr-2 text-green-500 text-2xl" />
        Broker Information
      </Title>

      <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 p-4 rounded-lg shadow-sm">
              <Title level={5} className="flex items-center mb-2">
                <ThunderboltOutlined className="mr-2 text-blue-500 text-xl" />
                Broker Address
              </Title>
              <Text className="text-gray-700 block">{broker}</Text>
            </div>

            <div className="bg-white/80 p-4 rounded-lg shadow-sm">
              <Title level={5} className="flex items-center mb-2">
                <MessageOutlined className="mr-2 text-green-500 text-xl" />
                Current Topic
              </Title>
              <Tag color="green" className="text-sm px-3 py-1">{topic}</Tag>
            </div>
          </div>

          <div>
            <Title level={5} className="flex items-center mb-2">
              <CodeOutlined className="mr-2 text-purple-500 text-xl" />
              Latest Payload
            </Title>
            <div className="bg-white rounded-lg shadow-inner p-4">
              <pre className="bg-gray-50 p-3 rounded-lg font-mono text-sm overflow-x-auto border border-gray-100">
                {formatJson(payload)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 