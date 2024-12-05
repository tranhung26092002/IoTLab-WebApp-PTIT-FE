// Profile.tsx
import React from 'react';
import { Modal, Avatar, Typography, Descriptions, Tag, Space } from 'antd';
import { IdcardOutlined, TeamOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const studentInfo = {
    id: "B20DCVT199",
    name: "Trần Văn Hưng",
    class: "D20VTHI03",
    email: "HungTV.B20VT199@stu.ptit.edu.vn",
    phone: "(+84) 386 527 618",
    major: "Hệ thống IoT"
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      className="profile-modal"
      centered
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        <div className="text-center mb-8">
          <Avatar
            size={120}
            src={`https://i.pravatar.cc/150?img=${2}`}
            className="border-4 border-[#4f6f52] shadow-lg"
          />
          <Typography.Title level={2} className="mt-4 mb-1 primary--color">
            {studentInfo.name}
          </Typography.Title>
          <Tag color="#4f6f52" className="text-base px-4 py-1">
            {studentInfo.major}
          </Tag>
        </div>

        <Descriptions
          bordered
          column={1}
          labelStyle={{ 
            backgroundColor: '#f5f8f5',
            fontWeight: 'bold',
            color: '#4f6f52'
          }}
          contentStyle={{
            backgroundColor: 'white'
          }}
        >
          <Descriptions.Item 
            label={
              <Space>
                <IdcardOutlined />
                Mã sinh viên
              </Space>
            }
          >
            {studentInfo.id}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Space>
                <TeamOutlined />
                Lớp
              </Space>
            }
          >
            {studentInfo.class}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Space>
                <MailOutlined />
                Email
              </Space>
            }
          >
            {studentInfo.email}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Space>
                <PhoneOutlined />
                Số điện thoại
              </Space>
            }
          >
            {studentInfo.phone}
          </Descriptions.Item>
        </Descriptions>
      </motion.div>
    </Modal>
  );
};

export default Profile;