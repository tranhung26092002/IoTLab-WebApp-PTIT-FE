import React from "react";
import { Button, Card, Typography, Space } from "antd";  // Cập nhật từ Flex thành Space

const Banner: React.FC = () => {
  return (
    <Card style={{ height: 260, padding: "20px" }}>
      <Space direction="vertical" size={30} style={{ width: "100%" }}>
        <Space direction="vertical" align="start" style={{ width: "100%" }}>
          <Typography.Title level={2}>
            Create and sell products
          </Typography.Title>
          <Typography.Text type="secondary" strong>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
            aliquam!
          </Typography.Text>
        </Space>

        <Space size="large">
          <Button type="primary" size="large">
            Explore More
          </Button>
          <Button size="large">Top Sellers</Button>
        </Space>
      </Space>
    </Card>
  );
};

export default Banner;
