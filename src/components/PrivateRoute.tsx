import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { notification } from 'antd';
import { tokenStorage } from '../services/tokenStorage';

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!tokenStorage.getAccessToken();
  const hasNotified = useRef(false); // Dùng ref để theo dõi trạng thái thông báo

  useEffect(() => {
    if (!isAuthenticated && !hasNotified.current) {
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để truy cập trang này',
        duration: 3,
      });
      hasNotified.current = true; // Đánh dấu đã thông báo
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />
  );
};

export default PrivateRoute;
