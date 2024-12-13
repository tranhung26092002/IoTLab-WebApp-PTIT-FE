import React, { useContext, useState } from 'react';
import { Card, Switch, Typography, Form, Radio, Button, Divider, message, Input, Modal } from 'antd';
import {
  BulbOutlined,
  BellOutlined,
  SecurityScanOutlined,
  MailOutlined,
  GlobalOutlined,
  ApiOutlined,
  TranslationOutlined,
  TeamOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { ThemeContext } from '../contexts/ThemeContext';
import AppLayout from '../components/AppLayout';
import { useUsers } from '../hooks/useUsers';
import { ChangePasswordDto } from '../types/user';

const { Title } = Typography;

const Setting: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [form] = Form.useForm();

  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [changePasswordForm] = Form.useForm();
  const { changePassword, isChangingPassword } = useUsers();

  const styles = {
    container: `
      p-8 max-w-6xl mx-auto
      animate-fadeIn
      bg-[var(--bg-secondary)]
    `,
    card: `
      group mb-6 rounded-lg
      border-l-4 border-[var(--text-primary)]
      hover:shadow-xl hover:scale-[1.01]
      transition-all duration-300 ease-in-out
      bg-[var(--card-bg)]
    `,
    header: `
      flex items-center gap-3 mb-4
      text-[var(--text-primary)]
    `,
    icon: `
      text-2xl 
      group-hover:scale-110 transition-transform
      text-[var(--text-secondary)]
    `,
    title: `
      text-xl font-semibold
      text-[var(--text-primary)]
    `,
    switch: `
      bg-[var(--text-secondary)]
      hover:opacity-90 transition-opacity
    `,
    button: `
      bg-[var(--text-primary)]
      hover:bg-[var(--text-secondary)]
      transition-colors text-white font-medium
    `,
    text: `
      text-[var(--text-primary)]
    `,
    sectionGrid: `
    grid grid-cols-1 md:grid-cols-2 gap-6
    `,
    cardContent: `
      p-6 h-full flex flex-col justify-between
      text-[var(--text-primary)]
    `,
    buttonGroup: `
      mt-4 space-x-2 flex justify-end
    `
  };

  const additionalSections = [
    {
      icon: <GlobalOutlined />,
      title: "Language & Region",
      content: (
        <div className="space-y-4">
          <Form.Item label="Language">
            <Radio.Group defaultValue="en">
              <Radio value="en">English</Radio>
              <Radio value="vi">Tiếng Việt</Radio>
              <Radio value="cn">中文</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Time Zone">
            <Radio.Group defaultValue="utc7">
              <Radio value="utc7">UTC+7</Radio>
              <Radio value="utc8">UTC+8</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      )
    },
    // {
    //   icon: <CloudOutlined />,
    //   title: "Cloud Storage",
    //   content: (
    //     <div className="space-y-4">
    //       <div className="flex justify-between items-center">
    //         <span>Auto Backup</span>
    //         <Switch className={styles.switch} />
    //       </div>
    //       <div className="flex justify-between items-center">
    //         <span>Sync Across Devices</span>
    //         <Switch className={styles.switch} />
    //       </div>
    //     </div>
    //   )
    // },
    // {
    //   icon: <DatabaseOutlined />,
    //   title: "Data Management",
    //   content: (
    //     <div className="space-y-4">
    //       <div className="flex justify-between items-center">
    //         <span>Data Analytics</span>
    //         <Switch className={styles.switch} />
    //       </div>
    //       <Button danger>Clear All Data</Button>
    //     </div>
    //   )
    // },
    // {
    //   icon: <TeamOutlined />,
    //   title: "Account Settings",
    //   content: (
    //     <div className="space-y-4">
    //       <div className="flex justify-between items-center">
    //         <span>Public Profile</span>
    //         <Switch className={styles.switch} />
    //       </div>
    //       <Button className={styles.button}>
    //         Manage Account
    //       </Button>
    //     </div>
    //   )
    // },
    // {
    //   icon: <ApiOutlined />,
    //   title: "API Access",
    //   content: (
    //     <div className="space-y-4">
    //       <div className="flex justify-between items-center">
    //         <span>Enable API Access</span>
    //         <Switch className={styles.switch} />
    //       </div>
    //       <Button className={styles.button}>
    //         Generate API Key
    //       </Button>
    //     </div>
    //   )
    // },
    {
      icon: <TranslationOutlined />,
      title: "IoT Device Settings",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Device Discovery</span>
            <Switch className={styles.switch} />
          </div>
          <div className="flex justify-between items-center">
            <span>Auto Connect</span>
            <Switch className={styles.switch} />
          </div>
          <Button className={styles.button}>
            Scan for Devices
          </Button>
        </div>
      )
    }
  ];

  const settingSections = [
    {
      icon: <BulbOutlined />,
      title: "Appearance",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Dark Mode</span>
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              className={styles.switch}
            />
          </div>
          <div className="flex justify-between items-center">
            <span>High Contrast</span>
            <Switch className={styles.switch} />
          </div>
        </div>
      )
    },
    {
      icon: <BellOutlined />,
      title: "Notifications",
      content: (
        <Form.Item>
          <Radio.Group defaultValue="all" className="space-y-3 w-full">
            <Radio value="all">All Notifications</Radio>
            <Radio value="important">Important Only</Radio>
            <Radio value="none">None</Radio>
          </Radio.Group>
        </Form.Item>
      )
    },
    {
      icon: <MailOutlined />,
      title: "Email Preferences",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Email Alerts</span>
            <Switch className={styles.switch} />
          </div>
          <div className="flex justify-between items-center">
            <span>Weekly Reports</span>
            <Switch className={styles.switch} />
          </div>
        </div>
      )
    },
    {
      icon: <SecurityScanOutlined />,
      title: "Security",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Two-Factor Authentication</span>
            <Switch className={styles.switch} />
          </div>
          <Button
            type="primary"
            className={styles.button}
            onClick={() => setIsChangePasswordModalVisible(true)}
          >
            Change Password
          </Button>
        </div>
      )
    },
    ...additionalSections
  ];

  const handleChangePassword = async (values: ChangePasswordDto) => {
    try {
      await changePassword(values);
      setIsChangePasswordModalVisible(false);
      changePasswordForm.resetFields();
    } catch {
      // Error handled by mutation
    }
  };

  const handleSave = () => {
    message.success('Settings saved successfully!');
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className="flex justify-between items-center mb-8">
          <Typography.Title level={2} className="forest--dark--color m-0 flex items-center gap-2">
            <SettingOutlined /> Contact
          </Typography.Title>
          <Button
            type="primary"
            className={styles.button}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>

        <Form form={form} layout="vertical" className={styles.sectionGrid}>
          {settingSections.map((section, index) => (
            <Card key={index} className={styles.card} bordered={false}>
              <div className={styles.cardContent}>
                <div>
                  <div className={styles.header}>
                    <span className={styles.icon}>{section.icon}</span>
                    <span className={styles.title}>{section.title}</span>
                  </div>
                  <Divider className="my-4" />
                  {section.content}
                </div>
              </div>
            </Card>
          ))}
        </Form>
      </div>

      <Modal
        title="Change Password"
        open={isChangePasswordModalVisible}
        onCancel={() => {
          setIsChangePasswordModalVisible(false);
          changePasswordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: 'Please input your current password!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => {
              setIsChangePasswordModalVisible(false);
              changePasswordForm.resetFields();
            }} className="mr-2">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isChangingPassword}
              className={styles.button}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default Setting;