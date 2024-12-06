import React, { useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "antd";
import LoginForm from "../components/login/LoginForm";
import RegisterForm from "../components/login/RegisterForm";
import logo_left from "../assets/login_left.png";
import logo_right from "../assets/login_right.png";
import logo_main from "../assets/logo-ptit.png";
import AppLayout from "../components/AppLayout";

const { Title } = Typography;

const Login: React.FC = () => {
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);

  return (
    <AppLayout>
      <div className="flex justify-center min-h-screen bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52] py-10">
        <div className="relative flex flex-col items-center w-full max-w-[1200px] px-5">
          <motion.div 
            className="absolute left-0 bottom-0 w-1/2 max-w-full h-full opacity-60"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logo_left} alt="logo_left" className="object-contain" />
          </motion.div>
          
          <motion.div 
            className="absolute right-0 bottom-0 w-1/2 max-w-full h-full opacity-60"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logo_right} alt="logo_right" className="object-contain" />
          </motion.div>

          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl z-10 w-full max-w-[400px] mt-[5vh]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex flex-col items-center w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.div 
                className="w-20 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={logo_main}
                  alt="logo_main"
                  className="w-full h-auto block drop-shadow-lg"
                />
              </motion.div>

              <motion.div 
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;