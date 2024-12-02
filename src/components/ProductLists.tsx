import React from 'react';
import { Button, Typography, Card, Image, Space } from 'antd';
import anh1 from '../assets/anh1.png';
import anh2 from '../assets/anh2.png';
import anh3 from '../assets/anh3.png';

// Khai báo kiểu cho plantData
interface Plant {
  id: number;
  name: string;
  picture: string;
}

// Danh sách các loại cây cảnh
const plantData: Plant[] = [
    { id: 1, name: 'Cây hoa hồng', picture: anh1 },
    { id: 2, name: 'Cây hoa cúc', picture: anh2 },
    { id: 3, name: 'Cây hoa sen', picture: anh3 },
];

const { Meta } = Card;

const ProductLists: React.FC = () => {
  return (
    <div>
      <Space align="baseline" style={{ marginBottom: '1rem' }}>
        <Typography.Title level={3} className="primary--color">
          My Listings
        </Typography.Title>
        <Button type="link" className="gray--color">
          View All
        </Button>
      </Space>

      <Space direction="horizontal" size="large" wrap>
        {plantData.map((plant: Plant) => (
          <Card key={plant.id} hoverable className="plant-card">
            <Image
              src={plant.picture}
              alt={plant.name}
              style={{ width: '130px', height: 'auto', objectFit: 'cover' }}
            />
            <Meta title={plant.name} style={{ marginTop: '1rem' }} />
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default ProductLists;
