import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const MyFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      My Application ©2024 Created by Me
    </Footer>
  );
};

export default MyFooter;
