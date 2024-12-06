// src/components/login/RegisterForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, Typography, Space, notification } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onToggleLogin: () => void;
}

const { Title } = Typography;

const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  email,
  password,
  confirmPassword,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleLogin,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const registerData = { 
        name: username, 
        email, 
        password, 
        role: "customer" 
      };

      // Your registration logic here
      // const action = await dispatch(registerUser(registerData));

      notification.success({
        message: "Thành công",
        description: "Đăng ký thành công!",
        duration: 2,
      });
      onToggleLogin();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin!",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="space-y-4"
      onFinish={handleSubmit}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Title level={2} className="text-center text-[#4f6f52]">
          Đăng ký
        </Title>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Form.Item
          label="Họ và tên"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-[#86a789]" />}
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
          />
        </Form.Item>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" }
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-[#86a789]" />}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
          />
        </Form.Item>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-[#86a789]" />}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            iconRender={(visible) =>
              visible ? (
                <EyeTwoTone twoToneColor="#4f6f52" />
              ) : (
                <EyeInvisibleOutlined className="text-[#86a789]" />
              )
            }
            className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
          />
        </Form.Item>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-[#86a789]" />}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            iconRender={(visible) =>
              visible ? (
                <EyeTwoTone twoToneColor="#4f6f52" />
              ) : (
                <EyeInvisibleOutlined className="text-[#86a789]" />
              )
            }
            className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
          />
        </Form.Item>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Space className="w-full" direction="vertical" size="middle">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 bg-[#4f6f52] hover:bg-[#739072]"
          >
            Đăng ký
          </Button>
          <Button
            onClick={onToggleLogin}
            className="w-full h-12 border-[#86a789] text-[#4f6f52] hover:bg-[#86a789] hover:text-white"
          >
            Quay lại đăng nhập
          </Button>
        </Space>
      </motion.div>
    </Form>
  );
};

export default RegisterForm;