import React from 'react';
import { Typography, Button, Avatar, List, Row, Col } from 'antd';

const data = [
  {
    name: 'Emma Turner',
    orderTime: 1,
  },
  {
    name: 'Liam Foster',
    orderTime: 1,
  },
  {
    name: 'Olivia Reed',
    orderTime: 2,
  },
  {
    name: 'Ethan Hayes',
    orderTime: 3,
  },
  {
    name: 'John',
    orderTime: 5,
  },
];

const Activity: React.FC = () => {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Col>
          <Typography.Title level={3} className="primary--color">
            Recent Activity
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" className="gray--color">
            View All
          </Button>
        </Col>
      </Row>

      <List
        pagination={{ pageSize: 5 }}
        dataSource={data}
        renderItem={(user, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={<Avatar src={`https://i.pravatar.cc/150?img=${index + 1}`} />}
              title={<a href="#">{user.name}</a>}
              description="Ordered a new plant"
            />
            <span className="gray--color">
              {user.orderTime} {user.orderTime === 1 ? 'day ago' : 'days ago'}
            </span>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Activity;
