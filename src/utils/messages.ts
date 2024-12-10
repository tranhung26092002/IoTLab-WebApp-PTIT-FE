export const SUCCESS_MESSAGES = {
    // Auth messages
    SIGN_UP: 'Đăng ký thành công!',
    SIGN_IN: 'Đăng nhập thành công!',
    SIGN_OUT: 'Đăng xuất thành công!',
    SEND_OTP: 'Mã OTP đã được gửi!',
    RESET_PASSWORD: 'Đặt lại mật khẩu thành công!',

    // User management
    CREATE_USER: 'Tạo người dùng thành công!',
    UPDATE_USER: 'Cập nhật người dùng thành công!',
    DELETE_USER: 'Xóa người dùng thành công!',

    // Course management
    CREATE_COURSE: 'Tạo khóa học thành công!',
    UPDATE_COURSE: 'Cập nhật khóa học thành công!',
    DELETE_COURSE: 'Xóa khóa học thành công!',

    // Task management
    CREATE_TASK: 'Tạo nhiệm vụ thành công!',
    UPDATE_TASK: 'Cập nhật nhiệm vụ thành công!',
    DELETE_TASK: 'Xóa nhiệm vụ thành công!'
} as const;

export const ERROR_MESSAGES = {
    // System errors
    NETWORK: 'Không thể kết nối tới máy chủ',
    DEFAULT: 'Có lỗi xảy ra, vui lòng thử lại!',
    SERVER_ERROR: 'Lỗi máy chủ, vui lòng thử lại sau!',

    // Auth errors
    INVALID_OTP: 'Mã OTP không hợp lệ',
    PHONE_EXISTS: 'Số điện thoại đã tồn tại',
    INVALID_CREDENTIALS: 'Thông tin đăng nhập không chính xác',
    JWT_EXPIRED: 'Phiên đăng nhập hết hạn',
    UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này',

    // Validation errors
    REQUIRED_FIELD: 'Vui lòng điền đầy đủ thông tin',
    INVALID_PHONE: 'Số điện thoại không hợp lệ',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số',
    PASSWORD_MISMATCH: 'Mật khẩu không khớp',

    // Resource errors
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
    COURSE_NOT_FOUND: 'Không tìm thấy khóa học',
    TASK_NOT_FOUND: 'Không tìm thấy nhiệm vụ'
} as const;