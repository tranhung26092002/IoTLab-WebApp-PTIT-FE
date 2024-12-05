import React, { useState } from "react";
import LoginForm from "../components/login/LoginForm";
import RegisterForm from "../components/login/RegisterForm";
import logo_left from "../assets/login_left.png";
import logo_right from "../assets/login_right.png";
import logo_main from "../assets/logo-ptit.png";
import AppLayout from "../components/AppLayout";

const Login: React.FC = () => {
  // Các trạng thái với kiểu dữ liệu cụ thể
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);

  return (
    <AppLayout>
      <div className="flex justify-center min-h-screen bg-[#f6f8fa] py-10">
        <div className="relative flex flex-col items-center w-full max-w-[1200px] px-5">
          {/* Hình ảnh bên trái */}
          <div className="absolute left-0 bottom-0 w-1/2 max-w-full h-full">
            <img
              src={logo_left}
              alt="logo_left"
            />
          </div>

          {/* Hình ảnh bên phải */}
          <div className="absolute right-0 bottom-0 w-1/2 max-w-full h-full">
            <img
              src={logo_right}
              alt="logo_right"
            />
          </div>

          {/* Form đăng nhập/đăng ký */}
          <div className="relative bg-white p-5 rounded-xl shadow-lg z-10 w-full max-w-[400px] mt-[5vh] ring-1 ring-gray-200">
            <div className="flex flex-col items-center w-full">
              {/* Logo */}
              <div className="w-20 mb-6">
                <img
                  src={logo_main}
                  alt="logo_main"
                  className="w-full h-auto block"
                />
              </div>

              {/* Form */}
              <div className="w-full">
                {!isRegister ? (
                  <LoginForm
                    email={email}
                    password={password}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onToggleRegister={() => setIsRegister(true)}
                  />
                ) : (
                  <RegisterForm
                    username={username}
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    onUsernameChange={setUserName}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    onToggleLogin={() => setIsRegister(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
