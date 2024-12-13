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
    DELETE_TASK: 'Xóa nhiệm vụ thành công!',

    // Device management
    CREATE_DEVICE: 'Tạo thiết bị thành công!',
    UPDATE_DEVICE: 'Cập nhật thiết bị thành công!',
    DELETE_DEVICE: 'Xóa thiết bị thành công!',
    BORROW_DEVICE: 'Mượn thiết bị thành công!',
    RETURN_DEVICE: 'Trả thiết bị thành công!',

    // Practice management
    CREATE_PRACTICE: 'Tạo bài thực hành thành công!',
    UPDATE_PRACTICE: 'Cập nhật bài thực hành thành công!',
    DELETE_PRACTICE: 'Xóa bài thực hành thành công!',
    ADD_VIDEO: 'Thêm video thành công!',
    DELETE_VIDEO: 'Xóa video thành công!',
    ADD_FILE: 'Thêm tài liệu thành công!',
    DELETE_FILE: 'Xóa tài liệu thành công!',
    ADD_GUIDE: 'Thêm hướng dẫn thành công!',
    UPDATE_GUIDE: 'Cập nhật hướng dẫn thành công!',
    DELETE_GUIDE: 'Xóa hướng dẫn thành công!',
    CHANGE_PASSWORD: 'Đổi mật khẩu thành công!',
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
    TASK_NOT_FOUND: 'Không tìm thấy nhiệm vụ',

    // Device errors
    DEVICE_NOT_FOUND: 'Không tìm thấy thiết bị',
    DEVICE_UNAVAILABLE: 'Thiết bị không khả dụng',
    DEVICE_ALREADY_BORROWED: 'Thiết bị đã được mượn',
    DEVICE_NOT_BORROWED: 'Thiết bị chưa được mượn',
    DEVICE_CODE_EXISTS: 'Mã thiết bị đã tồn tại',
    UNAUTHORIZED_BORROW: 'Bạn không có quyền mượn thiết bị này',
    UNAUTHORIZED_RETURN: 'Bạn không có quyền trả thiết bị này',

    // Practice errors
    PRACTICE_NOT_FOUND: 'Không tìm thấy bài thực hành',
    VIDEO_NOT_FOUND: 'Không tìm thấy video',
    FILE_NOT_FOUND: 'Không tìm thấy tài liệu',
    GUIDE_NOT_FOUND: 'Không tìm thấy hướng dẫn',
    INVALID_VIDEO_FORMAT: 'Định dạng video không hợp lệ',
    INVALID_FILE_FORMAT: 'Định dạng tài liệu không hợp lệ',
    FILE_TOO_LARGE: 'Kích thước tập tin quá lớn',
    UNAUTHORIZED_PRACTICE: 'Bạn không có quyền thao tác với bài thực hành này'
} as const;