import React from 'react';
import AppLayout from '../components/AppLayout';
import SideContent from '../components/home/SideContent';
import MainContent from '../components/home/MainContent';
import { Flex, Col, Row } from 'antd';
import VideoSection from '../components/home/VideoSection';
import ImageCarousel from '../components/home/ImageCarousel';
import LabInfo from '../components/home/LabInfo';

const Home: React.FC = () => {
  return (
    <AppLayout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52]">
        <Row gutter={[24, 24]}>
          {/* Lab Info Section */}
          <Col span={24}>
            <MainContent />
          </Col>

          {/* Video and Image Carousel Section */}
          <Col span={24}>
            <Flex gap={24}>
              <VideoSection />
              <ImageCarousel />
            </Flex>
          </Col>

          {/* Lab Info and Side Content */}
          <Col span={24}>
            <Flex gap={24}>
              <LabInfo />
              <SideContent />
            </Flex>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
};

export default Home;