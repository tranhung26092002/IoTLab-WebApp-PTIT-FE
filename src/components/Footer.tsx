import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const CustomFooter: React.FC = () => {
  return (
    <Footer className="bg-white shadow-inner py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Text className="text-[#4F6F52]">
          IoT Lab PTIT ©{new Date().getFullYear()} Created by Trần Văn Hưng
        </Text>
        
        <Space size={16}>
          <Link href="https://github.com/tranhung26092002" target="_blank" className="text-[#4F6F52] hover:text-[#86A789] transition-colors">
            <GithubOutlined className="text-xl" />
          </Link>
          <Link href="https://www.linkedin.com/in/tranhung2609/" target="_blank" className="text-[#4F6F52] hover:text-[#86A789] transition-colors">
            <LinkedinOutlined className="text-xl" />
          </Link>
          <Link href="https://www.facebook.com/tranhung2609" target="_blank" className="text-[#4F6F52] hover:text-[#86A789] transition-colors">
            <FacebookOutlined className="text-xl" />
          </Link>
        </Space>
      </div>
    </Footer>
  );
};

export default CustomFooter;
