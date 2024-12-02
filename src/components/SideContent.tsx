import React from "react";
import ContentSidebar from "./ContentSidebar";
import { Row, Col } from "antd"; // Import Row và Col
import Activity from "./Activity";

const SideContent: React.FC = () => {
  return (
    <Row gutter={[0, 24]} style={{ width: 350 }}>
      <Col span={24}>
        <ContentSidebar />
      </Col>
      <Col span={24}>
        <Activity />
      </Col>
    </Row>
  );
};

export default SideContent;
