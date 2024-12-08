import axios from 'axios';
import { authService } from './api/authService';
import { tokenStorage } from './tokenStorage';
import { API_BASE_URL } from '../config/env';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await authService.refreshToken();
                return api(error.config);
            } catch {
                tokenStorage.clearTokens();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;