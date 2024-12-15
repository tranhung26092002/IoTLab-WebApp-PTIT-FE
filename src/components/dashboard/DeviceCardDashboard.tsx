import React from 'react';
import { Card, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types/dashboard';
import { ApiOutlined, ArrowRightOutlined } from '@ant-design/icons';

interface DeviceCardProps {
    device: Device;
}

export const DeviceCardDashboard: React.FC<DeviceCardProps> = ({ device }) => {
    const navigate = useNavigate();

    return (
        <Card
            hoverable
            className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            actions={[
                <Button 
                    type="primary" 
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/admin/dashboard/${device.id}`)}
                    className="bg-[#4f6f52] hover:bg-[#2c4a2d] mr-2"
                >
                    View Details
                </Button>
            ]}
        >
            <div className="flex items-start gap-4">
                <div className="p-3 bg-[#d2e3c8] rounded-lg">
                    <ApiOutlined className="text-2xl text-[#4f6f52]" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2c4a2d] mb-2">{device.name}</h3>
                    <p className="text-gray-600 mb-2">ID: {device.deviceId}</p>
                    <p className="text-gray-600 mb-2">Location: {device.location}</p>
                    <Tag color="green" className="mt-2">{device.type}</Tag>
                </div>
            </div>
        </Card>
    );
};