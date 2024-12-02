import { Typography, Card, Image, Row, Col } from 'antd';
import React from 'react';
import plant from '../assets/anh2.png';

const ContentSidebar: React.FC = () => {
    return (
        <div>
            <Card className="card" style={{ position: 'relative' }}>
                <Row>
                    <Col span={24}>
                        <Typography.Title level={4}>
                            Today <br /> 10 Orders
                        </Typography.Title>
                        <Typography.Title level={4}>
                            This Month <br /> 240 Orders
                        </Typography.Title>
                    </Col>
                </Row>

                {/* Image */}
                <Image
                    src={plant}
                    alt="plant"
                    style={{
                        position: 'absolute',
                        bottom: -50,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'auto',
                        height: '300px',
                    }}
                />
            </Card>
        </div>
    );
};

export default ContentSidebar;
