export const SUCCESS_MESSAGES = {
    SIGN_UP: 'Đăng ký thành công!',
    SIGN_IN: 'Đăng nhập thành công!',
    SIGN_OUT: 'Đăng xuất thành công!',
    SEND_OTP: 'Mã OTP đã được gửi!',
    RESET_PASSWORD: 'Đặt lại mật khẩu thành công!'
} as const;

export const ERROR_MESSAGES = {
    NETWORK: 'Không thể kết nối tới máy chủ',
    INVALID_OTP: 'Mã OTP không hợp lệ',
    PHONE_EXISTS: 'Số điện thoại đã tồn tại',
    INVALID_CREDENTIALS: 'Thông tin đăng nhập không chính xác',
    JWT_EXPIRED: 'Phiên đăng nhập hết hạn',
    DEFAULT: 'Có lỗi xảy ra, vui lòng thử lại!'
} as const;