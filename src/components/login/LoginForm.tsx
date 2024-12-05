import React, { useState } from "react";
import { notification } from "antd";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onToggleRegister,
}) => {
  // const dispatch: DispatchType = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Hàm để toggle chế độ hiển thị mật khẩu
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  // const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  //   e.preventDefault();
  //   const loginData = { email, password };

  //   dispatch(loginUser(loginData))
  //     .then((action: any) => {
  //       if (action.payload.status === 200) {
  //         notification.success({
  //           message: "Thành công",
  //           description: "Đăng nhập thành công!",
  //           duration: 1,
  //         });
  //       } else {
  //         notification.error({
  //           message: "Lỗi",
  //           description: "Đăng nhập thất bại. Vui lòng thử lại!",
  //           duration: 1,
  //         });
  //       }
  //     })
  //     .catch(() => {
  //       notification.error({
  //         message: "Lỗi",
  //         description: "Đăng nhập thất bại. Vui lòng thử lại!",
  //         duration: 1,
  //       });
  //     });
  // };

  return (
    <form
      // onSubmit={handleLoginSubmit}
      className="relative bg-white p-5 rounded-xl shadow-lg z-10 w-full max-w-[400px] ring-1 ring-gray-200"
    >
      <div className="w-full text-center mb-4">
        <p className="text-2xl font-bold text-gray-800">Login</p>
      </div>

      <div className="w-full mb-4">
        <label className="block font-semibold text-gray-700 mb-2">
          Mã sinh viên:
        </label>
        <input
          className="w-full h-10 px-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          type="text"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="w-full mb-4">
        <label className="block font-semibold text-gray-700 mb-2">
          Mật khẩu:
        </label>
        <div className="relative">
          <input
            className="w-full h-10 px-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            type={showPassword ? "text" : "password"} // Đổi kiểu input giữa text và password
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
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

      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <label className="text-gray-600">Ghi nhớ đăng nhập</label>
        </div>
        <a
          href="/home/password/reset"
          className="text-blue-500 text-sm hover:underline"
        >
          Quên mật khẩu?
        </a>
      </div>

      <div className="w-full flex justify-between mt-4">
        <button
          type="submit"
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={onToggleRegister}
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors ml-2"
        >
          Đăng ký
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
