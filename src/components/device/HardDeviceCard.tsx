import React from 'react';
import { Card, Button, Tag } from 'antd';
import { HardDevice } from '../../types/hardDevice';
import { motion } from 'framer-motion';

interface Props {
    device: HardDevice;
    onLend: (device: HardDevice) => void;
}

export const HardDeviceCard: React.FC<Props> = ({ device, onLend }) => {
    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <Card
                hoverable
                cover={<img alt={device.name} src={device.imageUrl} />}
                actions={[
                    <Button
                        type="primary"
                        disabled={device.status === 'borrowed'}
                        onClick={() => onLend(device)}
                    >
                        {device.status === 'borrowed' ? 'Borrowed' : 'Borrow'}
                    </Button>
                ]}
            >
                <Card.Meta
                    title={device.name}
                    description={
                        <>
                            <div>{`${device.brand} - ${device.model}`}</div>
                            <Tag color={device.status === 'available' ? 'green' : 'red'}>
                                {device.status}
                            </Tag>
                        </>
                    }
                />
            </Card>
        </motion.div>
    );
};