import { SignInDto, SignUpDto, PhoneNumberDto, ResetPasswordDto, AuthResponse } from '../../types/auth';
import api from '../axios';
import { tokenStorage } from '../tokenStorage';

export const authService = {
  // Gửi OTP kiểm tra số điện thoại
  sendOtp: (phoneNumberDto: PhoneNumberDto) => api.post('/auth/check-phone-number', phoneNumberDto),

  // Đăng ký người dùng
  signUp: (signUpDto: SignUpDto) => api.post('/auth/sign-up', signUpDto),

  // Đăng nhập
  signIn: async (signInDto: SignInDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/sign-in', signInDto);
    // Store tokens on successful login
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },

  signOut: () => {
    tokenStorage.clearTokens();
  },

  refreshToken: async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.post<AuthResponse>('/auth/refresh-token', {
      refreshToken
    });
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },

  // Quên mật khẩu và gửi OTP
  forgotPassword: (phoneNumberDto: PhoneNumberDto) => api.post('/auth/forgot-password', phoneNumberDto),

  // Đặt lại mật khẩu
  resetPassword: (resetPasswordDto: ResetPasswordDto) => api.post('/auth/reset-password', resetPasswordDto),

  // Add token management methods
  setTokens: (accessToken: string, refreshToken: string) => {
    tokenStorage.setTokens(accessToken, refreshToken);
  },

  getAccessToken: () => tokenStorage.getAccessToken(),

  getRefreshToken: () => tokenStorage.getRefreshToken(),

  clearTokens: () => tokenStorage.clearTokens()
};
