import React, { useEffect, useState } from 'react';
import { Modal, Avatar, Typography, Descriptions, Tag, Space, Spin, Button, Input, DatePicker, Form, Select, Upload } from 'antd';
import { IdcardOutlined, TeamOutlined, MailOutlined, PhoneOutlined, UserOutlined, CalendarOutlined, CameraOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useUsers } from '../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { User } from '../types/user';
import { useImageView } from '../services/api/storageService';
import defaultImage from '../assets/default-device.png';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { getMe, me, isLoadingMe, updateMe, isUpdatingMe } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);


  const { viewImage } = useImageView();
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultImage);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const loadAvatar = async () => {
      if (me?.avatarUrl) {
        setIsLoadingAvatar(true);
        try {
          const { url, cleanup: cleanupFn } = await viewImage(me.avatarUrl);
          setAvatarUrl(url);
          cleanup = cleanupFn;
        } catch (error) {
          console.error('Failed to load avatar:', error);
          setAvatarUrl(defaultImage);
        } finally {
          setIsLoadingAvatar(false);
        }
      }
    };

    loadAvatar();

    return () => {
      if (cleanup) cleanup();
      setAvatarUrl(defaultImage);
    };
  }, [me?.avatarUrl]);

  useEffect(() => {
    if (isOpen && getMe) {
      getMe().catch(err => {
        console.error('Failed to fetch user profile:', err);
        navigate("/login");
      });
    }
  }, [isOpen, getMe, navigate]);

  useEffect(() => {
    if (me) {
      form.setFieldsValue({
        ...me,
        dateOfBirth: me.dateOfBirth ? dayjs(me.dateOfBirth) : undefined
      });
    }
  }, [me, form]);


  const handleAvatarChange = (info: any) => {
    if (info.file) {
      setAvatarFile(info.file);
      const previewUrl = URL.createObjectURL(info.file);
      setAvatarPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const userData = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD')
      };

      await updateMe({
        data: userData,
        file: avatarFile || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderContent = (key: keyof User): React.ReactNode => {
    if (!isEditing) {
      const value = me?.[key];
      if (!value) return 'N/A';

      if (key === 'dateOfBirth') {
        return dayjs(value).format('DD-MM-YYYY');
      }

      if (key === 'gender') {
        const genderMap: Record<string, string> = {
          MALE: 'Nam',
          FEMALE: 'Nữ',
          OTHER: 'Khác'
        };
        return genderMap[value] || value;
      }

      return String(value);
    }

    switch (key) {
      case 'dateOfBirth':
        return <Form.Item name={key} noStyle><DatePicker format="DD-MM-YYYY" /></Form.Item>;
      case 'gender':
        return (
          <Form.Item name={key} noStyle>
            <Select style={{ width: '100%' }}>
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Form.Item>
        );
      default:
        return <Form.Item name={key} noStyle><Input /></Form.Item>;
    }
  };

  if (isLoadingMe) {
    return (
      <Modal open={isOpen} onCancel={onClose} footer={null} width={600} centered>
        <div className="flex justify-center items-center p-20">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="flex justify-end">
          {!isEditing ? (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Cập nhật
            </Button>
          ) : (
            <Space>
              <Button onClick={() => setIsEditing(false)}>Hủy</Button>
              <Button type="primary" onClick={handleSave} loading={isUpdatingMe}>
                Lưu
              </Button>
            </Space>
          )}
        </div>
      }
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
        <div className="text-center mb-8 relative">
          <div className="relative inline-block">
            <Avatar
              size={120}
              src={avatarPreview || avatarUrl}
              className="border-4 border-[#4f6f52] shadow-lg"
            />
            {isEditing && (
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAvatarChange({ file });
                  return false;
                }}
              >
                <Button
                  icon={<CameraOutlined />}
                  className="absolute bottom-0 right-0 rounded-full"
                  type="primary"
                />
              </Upload>
            )}
          </div>
          <Typography.Title level={2} className="mt-4 mb-1 primary--color">
            {me?.fullName || 'N/A'}
          </Typography.Title>
          <Tag color="#4f6f52" className="text-base px-4 py-1">
            {me?.roleType || 'N/A'}
          </Tag>
        </div>

        <Form form={form} layout="vertical">
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
            <Descriptions.Item label={<Space><IdcardOutlined />Mã sinh viên</Space>}>
              {me?.userName || 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><UserOutlined />Họ và tên</Space>}>
              {renderContent('fullName')}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><TeamOutlined />Giới tính</Space>}>
              {renderContent('gender')}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><MailOutlined />Email</Space>}>
              {renderContent('email')}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><PhoneOutlined />Số điện thoại</Space>}>
              {renderContent('phoneNumber')}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><CalendarOutlined />Ngày sinh</Space>}>
              {renderContent('dateOfBirth')}
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default Profile;