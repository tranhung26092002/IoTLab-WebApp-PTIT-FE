import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Space, Modal, notification } from "antd";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const { Title } = Typography;

const RegisterForm: React.FC<{ onToggleLogin: () => void }> = ({ onToggleLogin }) => {
  const [form] = Form.useForm();
  const { sendOtp, signUp, isOtpLoading, isSignUpLoading } = useAuth();
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(120);
  const [isResendAllowed, setIsResendAllowed] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isOtpModalVisible && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsResendAllowed(true);
    }
    return () => clearInterval(interval);
  }, [isOtpModalVisible, timer]);

  const resetOtpState = () => {
    setTimer(60);
    setIsResendAllowed(false);
    setOtpValue("");
  };

  const handleSendOtp = async () => {
    try {
      const values = await form.validateFields();
      let { phoneNumber } = values;

      // Kiểm tra số điện thoại hợp lệ
      if (/^0[0-9]{9}$/.test(phoneNumber)) {
        // Thay thế số bắt đầu bằng 0 thành +84
        phoneNumber = phoneNumber.replace(/^0/, "+84");
      } else if (!/^\+84[0-9]{9}$/.test(phoneNumber)) {
        // Số không hợp lệ
        form.setFields([
          {
            name: "phoneNumber",
            errors: ["Số điện thoại không hợp lệ!"],
          },
        ]);
        return;
      }

      // Lưu lại giá trị số điện thoại đã chuẩn hóa vào form
      form.setFieldsValue({ phoneNumber });

      // Gửi OTP
      await sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            setIsOtpModalVisible(true);
            resetOtpState();
          }
        }
      );
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpValue) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập mã OTP!",
      });
      return;
    }

    try {
      const { username, phoneNumber, password, confirmPassword } = form.getFieldsValue();
      await signUp({
        otpCodeDto: { phoneNumber, otpCode: otpValue },
        username,
        password,
        confirmPassword,
      },
        {
          onSuccess: () => {
            setIsOtpModalVisible(false);
            onToggleLogin();
          }
        }
      );

    } catch {
      notification.error({
        message: "Đăng ký không thành công",
        description: "Đã có lỗi xảy ra khi đăng ký, vui lòng thử lại!",
      });
    }
  };

  const handleResendOtp = async () => {
    const phoneNumber = form.getFieldValue("phoneNumber");
    if (!phoneNumber) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy số điện thoại. Vui lòng nhập lại!",
      });
      return;
    }

    try {
      await sendOtp({ phoneNumber });
      notification.success({
        message: "Thành công",
        description: "Mã OTP mới đã được gửi!",
      });
      resetOtpState();
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể gửi lại OTP, vui lòng thử lại!",
      });
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" className="space-y-4" onFinish={handleSendOtp}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <Title level={2} className="text-center text-[#4f6f52]">Đăng ký</Title>
        </motion.div>

        <Form.Item
          label="Mã sinh viên"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập mã sinh viên!" },
            {
              pattern: /^[A-Z0-9]+$/,
              message: "Mã sinh viên chỉ chứa chữ in hoa và số!"
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-[#86a789]" />}
            className="h-12"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^(\+84|0)[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input
            className="h-12"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              message: "Mật khẩu phải chứa cả chữ và số!"
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-[#86a789]" />}
            iconRender={(visible) => visible ? <EyeTwoTone twoToneColor="#4f6f52" /> : <EyeInvisibleOutlined className="text-[#86a789]" />}
            className="h-12"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            className="h-12"
            autoComplete="new-password"
          />
        </Form.Item>

        <Space className="w-full flex justify-center">
          <Button type="primary" htmlType="submit" loading={isOtpLoading} className="w-[180px] h-12 bg-[#4f6f52] hover:bg-[#739072]">
            Đăng ký
          </Button>
          <Button onClick={onToggleLogin} className="w-[180px] h-12 border-[#86a789] text-[#4f6f52] hover:bg-[#86a789] hover:text-white">
            Quay lại đăng nhập
          </Button>
        </Space>
      </Form>

      <Modal
        title="Nhập mã OTP"
        open={isOtpModalVisible}
        onCancel={() => {
          setIsOtpModalVisible(false);
          setOtpValue("");
        }}
        footer={[
          <Button key="resend" onClick={handleResendOtp} disabled={!isResendAllowed} className="text-[#4f6f52]">
            Gửi lại OTP {!isResendAllowed && `(${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")})`}
          </Button>,
          <Button key="submit" type="primary" onClick={handleOtpSubmit} loading={isSignUpLoading} className="bg-[#4f6f52]">
            Xác nhận
          </Button>,
        ]}
      >
        <Input
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          placeholder="Nhập mã OTP"
          className="h-12 mb-4"
        />
        <p className="text-gray-500">
          Mã OTP đã được gửi đến số điện thoại {form.getFieldValue("phoneNumber") || "chưa xác định"}
        </p>
      </Modal>
    </>
  );
};

export default RegisterForm;
