import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ForgotPasswordModal } from '../forgotPassword/ForgotPasswordModal';
import { ResetPasswordModal } from '../forgotPassword/ResetPasswordModal';
import { GoogleLogin } from '@react-oauth/google';

const { Title } = Typography;

const LoginForm: React.FC<{ onToggleRegister: () => void }> = ({ onToggleRegister }) => {
  const navigate = useNavigate();
  const { 
    signIn, 
    signInWithGoogle,
    forgotPassword, 
    resetPassword, 
    isSignInLoading, 
    isSignInWithGoogleLoading,
    isForgotPasswordLoading, 
    isResetPasswordLoading 
  } = useAuth();
  const [form] = Form.useForm();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() =>
    localStorage.getItem('rememberMe') === 'true'
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { userName, password } = values;

      await signIn(
        { userName, password },
        {
          onSuccess: () => {
            navigate('/');
          }
        }
      );

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userName', userName);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userName');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword({ email });
      setShowForgotPassword(false);
      setShowResetPassword(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  const handleResetPassword = async (values: { otp: string; newPassword: string; confirmNewPassword: string }) => {
    try {
      await resetPassword({
        otp: values.otp,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      });
      setShowResetPassword(false);
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await signInWithGoogle(credentialResponse.credential, {
        onSuccess: () => {
          navigate('/');
        }
      });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
        disabled={isSignInLoading}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <Title level={2} className="text-center text-[#4f6f52]">Đăng nhập</Title>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Form.Item
            label="Mã sinh viên:"
            name="userName"
            rules={[
              { required: true, message: 'Vui lòng nhập Mã sinh viên!' },
              { type: 'string', message: 'Mã sinh viên không hợp lệ!' },
              {
                pattern: /^[A-Z0-9]+$/,
                message: 'Mã sinh viên không đúng định dạng!'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-[#86a789]" />}
              className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
              autoComplete="userName"
              placeholder="Nhập mã sinh viên của bạn"
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
              iconRender={(visible) =>
                visible ? <EyeTwoTone twoToneColor="#4f6f52" /> : <EyeInvisibleOutlined className="text-[#86a789]" />
              }
              className="h-12 hover:border-[#86a789] focus:border-[#4f6f52]"
              autoComplete="current-password" 
            />
          </Form.Item>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <div className="flex justify-between items-center">
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="text-[#4f6f52]"
            >
              Ghi nhớ đăng nhập
            </Checkbox>
            <a onClick={handleForgotPasswordClick} className="text-[#4f6f52] hover:text-[#739072]">
              Quên mật khẩu?
            </a>
          </div>
        </motion.div>

        <motion.div>
          <Space className="w-full flex justify-center" direction="vertical" size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSignInLoading}
              className="w-full h-12 bg-[#4f6f52] hover:bg-[#739072]"
            >
              {isSignInLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            <Button
              onClick={onToggleRegister}
              disabled={isSignInLoading}
              className="w-full h-12 border-[#86a789] text-[#4f6f52] hover:bg-[#86a789] hover:text-white"
            >
              Đăng ký
            </Button>
          </Space>
        </motion.div>

        <Divider className="text-[#4f6f52]">Hoặc</Divider>

        <motion.div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              locale="vi"
            />
          </div>
        </motion.div>
      </Form>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPassword}
        loading={isForgotPasswordLoading}
      />

      <ResetPasswordModal
        visible={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onSubmit={handleResetPassword}
        loading={isResetPasswordLoading}
      />
    </>
  );
};

export default LoginForm;