import { User } from "./user";

export interface SignInDto {
    phoneNumber: string;
    password: string;
}

export interface OtpCodeDto {
    phoneNumber: string;
    otpCode: string;
}

export interface SignUpDto {
    otpCodeDto: OtpCodeDto;
    password: string;
}

export interface PhoneNumberDto {
    phoneNumber: string;
}

export interface ResetPasswordDto {
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}
