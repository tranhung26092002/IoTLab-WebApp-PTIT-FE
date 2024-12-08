import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title } = Typography;

interface LoginFormProps {
  phoneNumber: string;
  password: string;
  onPhoneNumberChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  phoneNumber,
  password,
  onPhoneNumberChange,
  onPasswordChange,
  onToggleRegister
}) => {
  const navigate = useNavigate();
  const { signIn, isSignInLoading, signInError } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      // Validate phone number format
      if (!/^\+?[0-9]{10,}$/.test(phoneNumber)) {
        message.error('Số điện thoại không hợp lệ!');
        return;
      }

      await signIn({ phoneNumber, password });
      message.success('Đăng nhập thành công!');
      // navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403) {
        message.error('Số điện thoại hoặc mật khẩu không chính xác!');
      } else if (error.name === 'ValidationError') {
        message.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
      } else {
        message.error('Lỗi đăng nhập, vui lòng thử lại sau!');
      }
      console.error('Login error:', error);
    }
  };

  // Add error display component
  const renderError = () => {
    if (!signInError) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center mt-2 p-2 bg-red-50 rounded"
      >
        {signInError.response?.status === 403
          ? 'Số điện thoại hoặc mật khẩu không chính xác!'
          : 'Lỗi đăng nhập, vui lòng thử lại sau!'}
      </motion.div>
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
      disabled={isSignInLoading}
    >
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
        <Title level={2} className="text-center text-[#4f6f52]">Login</Title>
      </motion.div>

      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^\+?[0-9\s-]+$/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-[#86a789]" />}
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
          />
        </Form.Item>
      </motion.div>

      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-[#86a789]" />}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            iconRender={(visible) =>
              visible ? <EyeTwoTone twoToneColor="#4f6f52" /> : <EyeInvisibleOutlined className="text-[#86a789]" />
            }
            className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
          />
        </Form.Item>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }} className="flex justify-between items-center">
        <Checkbox className="text-[#4f6f52]">Ghi nhớ đăng nhập</Checkbox>
        <a href="/forgot-password" className="text-[#4f6f52] hover:text-[#739072]">
          Quên mật khẩu?
        </a>
      </motion.div>

      {signInError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-center"
        >
          {signInError.message}
        </motion.div>
      )}

      {renderError()}

      <motion.div>
        <Space className="w-full flex justify-center" direction="horizontal" size="middle">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSignInLoading}
            className="w-[180px] h-12 bg-[#4f6f52] hover:bg-[#739072]"
          >
            {isSignInLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
          <Button
            onClick={onToggleRegister}
            className="w-[180px] h-12 border-[#86a789] text-[#4f6f52] hover:bg-[#86a789] hover:text-white"
          >
            Đăng ký
          </Button>
        </Space>
      </motion.div>
    </Form>
  );
};

export default LoginForm;