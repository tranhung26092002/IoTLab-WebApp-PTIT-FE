// src/components/login/LoginForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Space } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { motion } from "framer-motion";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleRegister: () => void;
}

const { Title } = Typography;

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onToggleRegister,
}) => {
  return (
    <Form layout="vertical" className="space-y-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Title level={2} className="text-center text-[#4f6f52]">
          Login
        </Title>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Form.Item
          label="Mã sinh viên"
          rules={[{ required: true, message: "Please input your student ID!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-[#86a789]" />}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
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
          label="Mật khẩu"
          rules={[{ required: true, message: "Please input your password!" }]}
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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex justify-between items-center"
      >
        <Checkbox className="text-[#4f6f52]">Ghi nhớ đăng nhập</Checkbox>
        <a href="/forgot-password" className="text-[#4f6f52] hover:text-[#739072]">
          Quên mật khẩu?
        </a>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Space className="w-full" direction="vertical" size="middle">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[#4f6f52] hover:bg-[#739072]"
          >
            Đăng nhập
          </Button>
          <Button
            onClick={onToggleRegister}
            className="w-full h-12 border-[#86a789] text-[#4f6f52] hover:bg-[#86a789] hover:text-white"
          >
            Đăng ký
          </Button>
        </Space>
      </motion.div>
    </Form>
  );
};

export default LoginForm;