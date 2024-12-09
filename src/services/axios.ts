import axios from 'axios';
import { authService } from './api/authService';
import { tokenStorage } from './tokenStorage';
import { API_BASE_URL } from '../config/env';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor cho request để tự động đính kèm accessToken nếu có
api.interceptors.request.use((config) => {
    // Kiểm tra xem có phải là request logout không
    if (config.headers['isLogoutRequest'] === 'true') {
        // Nếu là request logout, không thêm accessToken vào header
        delete config.headers['Authorization']; // Xóa Authorization nếu là logout request
    } else {
        // Nếu không phải request logout, tự động thêm accessToken
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});

// Thêm interceptor cho response để xử lý trường hợp token hết hạn (401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                // Get new tokens
                const newTokens = await authService.refreshToken();

                // Update token in error config
                error.config.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;

                // Retry original request
                return api(error.config);
            } catch (refreshError) {
                // Log refresh error and clear tokens
                console.error('Token refresh failed:', refreshError);
                tokenStorage.clearTokens();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
