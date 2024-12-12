import React from 'react';
import { Card, Button, Tag, Typography, Tooltip, Spin, Image } from 'antd';
import { Device } from '../../types/hardDevice';
import { motion } from 'framer-motion';
import { CalendarOutlined } from '@ant-design/icons';
import defaultImage from '../../assets/default-device.png';
import { useAvatar } from '../../hooks/useAvatar';

const { Text } = Typography;
interface Props {
    device: Device;
    onBorrow: (device: Device) => void;
}

export const HardDeviceCard: React.FC<Props> = ({ device, onBorrow }) => {
    const { imageUrl, isLoading: isLoadingDeviceImage } = useAvatar(device.imageUrl);

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <Card
                hoverable
                cover={
                    <div className="h-48 flex items-center justify-center bg-gray-50">
                        {isLoadingDeviceImage ? (
                            <Spin />
                        ) : (
                            <Image
                                alt={device.name}
                                src={imageUrl}
                                fallback={defaultImage}
                                preview={false}
                                height={192}
                                style={{
                                    objectFit: 'contain',
                                    backgroundColor: '#f5f5f5'
                                }}
                            />
                        )}
                    </div>
                }
                actions={[
                    <Button
                        type={device.status === 'BORROWED' ? 'default' : 'primary'}
                        disabled={device.status === 'BORROWED'}
                        onClick={() => onBorrow(device)}
                        className={device.status === 'BORROWED' ? 'text-gray-500 bg-gray-100' : ''}
                    >
                        {device.status === 'BORROWED' ? 'Borrowed' : 'Borrow'}
                    </Button>
                ]}
            >
                <Card.Meta
                    title={
                        <div className="flex flex-col">
                            <Tooltip title={device.code}>
                                <Text strong className="text-lg">{device.name}</Text>
                            </Tooltip>
                            <Text type="secondary" className="text-sm">{device.code}</Text>
                        </div>
                    }
                    description={
                        <div className="space-y-3 mt-2">
                            <div className="flex justify-between items-center">
                                <Text type="secondary" className="text-sm">{device.type}</Text>
                                <Tag color={device.status === 'AVAILABLE' ? 'green' : 'red'}>
                                    {device.status}
                                </Tag>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <CalendarOutlined />
                                <Text type="secondary">
                                    Total borrowed: {device.totalBorrowed}
                                </Text>
                            </div>

                            {device.description && (
                                <Text type="secondary" className="block text-sm">
                                    {device.description}
                                </Text>
                            )}
                        </div>
                    }
                />
            </Card>
        </motion.div>
    );
};