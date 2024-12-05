import React from 'react';
import AppLayout from '../components/AppLayout';
import SideContent from '../components/SideContent';
import MainContent from '../components/MainContent';
import { Flex } from 'antd';

const Home: React.FC = () => {
  return (
    <AppLayout>
      <Flex>
        <MainContent />
        <SideContent />
      </Flex>
    </AppLayout>
  );
};

export default Home;
