import React from "react";
import { Space } from "antd";  // Thay Flex thành Space
import Banner from "./Banner";
import ProductLists from "./ProductLists";
import SellerLists from "./SellerLists";

const MainContent: React.FC = () => {
  return (
    <div style={{ flex: 1 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Banner />
        <ProductLists />
        <SellerLists />
      </Space>
    </div>
  );
};

export default MainContent;
