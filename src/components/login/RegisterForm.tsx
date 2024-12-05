import React, { useState } from "react";
import { notification, Spin } from "antd";

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
//   const dispatch: DispatchType = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra email hợp lệ
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra đầu vào
    if (!username.trim()) {
      notification.error({
        message: "Lỗi",
        description: "Họ và tên không được để trống!",
        duration: 1,
      });
      return;
    }
    if (!validateEmail(email)) {
      notification.error({
        message: "Lỗi",
        description: "Email không hợp lệ!",
        duration: 1,
      });
      return;
    }
    if (password.length < 6) {
      notification.error({
        message: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự!",
        duration: 1,
      });
      return;
    }
    if (password !== confirmPassword) {
      notification.error({
        message: "Lỗi",
        description: "Mật khẩu xác nhận không khớp!",
        duration: 1,
      });
      return;
    }

    const registerData = { name: username, email, password, role: "customer" };

    try {
      setLoading(true);
      const action: any = await dispatch(registerUser(registerData));
      setLoading(false);

      if (action.payload?.status === 200) {
        notification.success({
          message: "Thành công",
          description: "Đăng ký thành công!",
          duration: 1,
        });
        onToggleLogin();
      } else {
        notification.error({
          message: "Lỗi",
          description: action.payload?.message || "Đăng ký thất bại!",
          duration: 1,
        });
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra, vui lòng thử lại!",
        duration: 1,
      });
    }
  };

  return (
    <form
      onSubmit={handleRegisterSubmit}
      className="relative bg-white p-5 rounded-xl shadow-lg z-10 w-full max-w-[400px] ring-1 ring-gray-200"
    >
      <div className="w-full text-center mb-4">
        <p className="text-2xl font-bold text-gray-800">Register</p>
      </div>
      <div className="w-full mb-4">
        <label className="block font-semibold text-gray-700 mb-2">Họ và tên:</label>
        <input
          className="w-full h-10 px-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />
      </div>

      <div className="w-full mb-4">
        <label className="block font-semibold text-gray-700 mb-2">Email:</label>
        <input
          className="w-full h-10 px-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="w-full mb-4">
        <label className="block font-semibold text-gray-700 mb-2">Mật khẩu:</label>
        <div className="relative">
          <input
            className="w-full h-10 px-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <i
              className={`fa-solid ${
                showPassword ? "fa-eye" : "fa-eye-slash"
              } text-gray-500 w-5 h-5`}
            ></i>
          </button>
        </div>
      </div>

      <div className="w-full mb-4">
        <label className="block font-semibold text-gray-700 mb-2">Xác nhận mật khẩu:</label>
        <div className="relative">
          <input
            className="w-full h-10 px-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <i
              className={`fa-solid ${
                showConfirmPassword ? "fa-eye" : "fa-eye-slash"
              } text-gray-500 w-5 h-5`}
            ></i>
          </button>
        </div>
      </div>

      <div className="w-full flex justify-between mt-4">
        <button
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : "Đăng ký"}
        </button>
        <button
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors ml-2"
          type="button"
          onClick={onToggleLogin}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
