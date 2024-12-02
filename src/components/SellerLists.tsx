import React from 'react';
import { Typography, Button, Avatar, Card, Tooltip, Divider, Row, Col } from 'antd';

const SellerSection = ({ title, avatarList, plantSold, sellerCount }: { 
  title: string; 
  avatarList: number[];  // Sử dụng số để tạo URL avatar
  plantSold: number; 
  sellerCount: number;
}) => {
  return (
    <Col span={24}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Typography.Title level={5} className="primary--color">
          {title}
        </Typography.Title>
        <Button type="link" className="gray--color">
          View All
        </Button>
      </Row>

      <Card>
        <Row align="middle" justify="space-evenly">
          <Avatar.Group maxCount={5} maxPopoverTrigger="click" size="large" maxStyle={{
            color: '#f56a00',
            backgroundColor: '#fd3cf',
            cursor: 'progress',
          }}>
            {avatarList.map((index) => (
              <Tooltip key={index} title={`User ${index}`} placement="top">
                <Avatar src={`https://i.pravatar.cc/150?img=${index}`} />
              </Tooltip>
            ))}
          </Avatar.Group>

          <Divider type="vertical" className="divider" />
          
          <Col>
            <Typography.Text type="secondary" strong>
              {plantSold} plants sold
            </Typography.Text>
            <Typography.Text type="secondary" strong>
              {sellerCount} sellers
            </Typography.Text>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

const SellerLists: React.FC = () => {
  // Mảng số để tạo URL avatar từ https://i.pravatar.cc/150?img={index}
  const avatarList = [1, 2, 3, 4, 5];

  return (
    <Row gutter={[16, 16]} style={{ width: '100%' }}>
      <SellerSection 
        title="Top Seller" 
        avatarList={avatarList} 
        plantSold={1200} 
        sellerCount={10} 
      />
      <SellerSection 
        title="Featured Seller" 
        avatarList={avatarList} 
        plantSold={1530} 
        sellerCount={13} 
      />
    </Row>
  );
};

export default SellerLists;
