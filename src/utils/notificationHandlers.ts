import { notification } from 'antd';
import { AxiosError } from 'axios';
import { ApiError } from '../types/ApiError';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from './messages';

export const handleSuccess = (messageKey: keyof typeof SUCCESS_MESSAGES) => {
    notification.success({
        message: 'Thành công',
        description: SUCCESS_MESSAGES[messageKey]
    });
};

export const handleApiError = (error: AxiosError<ApiError>) => {
    const apiError = error.response?.data;

    if (apiError) {
        let errorMessage = apiError.message;

        switch (apiError.status) {
            case 400:
                if (apiError.message.includes('OTP')) {
                    errorMessage = ERROR_MESSAGES.INVALID_OTP;
                }
                break;
            case 409:
                if (apiError.path.includes('phone')) {
                    errorMessage = ERROR_MESSAGES.PHONE_EXISTS;
                }
                break;
            case 401:
            case 403:
                errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
                break;
        }

        notification.error({
            message: 'Lỗi',
            description: errorMessage || ERROR_MESSAGES.DEFAULT
        });
    } else {
        notification.error({
            message: 'Lỗi',
            description: ERROR_MESSAGES.NETWORK
        });
    }
};