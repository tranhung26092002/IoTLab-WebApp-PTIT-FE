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
    // Lưu token khi đăng nhập thành công
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data; // Trả về dữ liệu AuthResponse
  },

  signOut: async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token not available');
    }

    // Gửi refreshToken về backend để thu hồi
    await api.post('/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`, // Gửi refreshToken trong header
        'isLogoutRequest': 'true', // Thêm flag đặc biệt cho request logout
      }
    });

    // Xóa token khi đăng xuất thành công
    tokenStorage.clearTokens();
    tokenStorage.clearRememberedLogin();
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.post<AuthResponse>('/auth/refresh-token', {
      refreshToken
    });
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data; // Trả về dữ liệu mới từ việc làm mới token
  },

  // Quên mật khẩu và gửi OTP
  forgotPassword: (phoneNumberDto: PhoneNumberDto) => api.post('/auth/forgot-password', phoneNumberDto),

  // Đặt lại mật khẩu
  resetPassword: (resetPasswordDto: ResetPasswordDto) => api.post('/auth/reset-password', resetPasswordDto),

  // Add token management methods
  setTokens: (accessToken: string, refreshToken: string) => {
    tokenStorage.setTokens(accessToken, refreshToken); // Lưu token vào local storage
  },

  getAccessToken: () => tokenStorage.getAccessToken(), // Lấy token truy cập từ storage

  getRefreshToken: () => tokenStorage.getRefreshToken(), // Lấy token làm mới từ storage

  clearTokens: () => tokenStorage.clearTokens() // Xóa các token khỏi storage
};
