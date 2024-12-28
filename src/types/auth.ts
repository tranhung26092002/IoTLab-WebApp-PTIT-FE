import { User } from "./user";

export interface SignInDto {
    email: string;
    password: string;
}

export interface OtpCodeDto {
    email: string;
    otpCode: string;
}

export interface SignUpDto {
    otpCodeDto: OtpCodeDto;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface EmailDto {
    email: string;
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
