// src/components/AdminRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { notification } from 'antd';
import { useEffect } from 'react';
import { tokenStorage } from '../services/tokenStorage';

const AdminRoute = () => {
    const location = useLocation();
    const token = tokenStorage.getAccessToken();

    const checkAdmin = () => {
        if (!token) return false;

        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.authorities?.includes('ROLE_ADMIN');
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (!token) {
            notification.warning({
                message: 'Yêu cầu đăng nhập',
                description: 'Vui lòng đăng nhập để truy cập trang này',
                duration: 3
            });
        } else if (!checkAdmin()) {
            notification.error({
                message: 'Không có quyền truy cập',
                description: 'Bạn không có quyền truy cập trang này',
                duration: 3
            });
        }
    }, [token]);

    return checkAdmin() ? (
        <Outlet />
    ) : (
        <Navigate
            to="/login"
            replace
            state={{ from: location }}
        />
    );
};

export default AdminRoute;