import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api/authService';
import { SignInDto, SignUpDto, PhoneNumberDto, ResetPasswordDto, AuthResponse } from '../types/auth';
import { User } from '../types/user';
import { tokenStorage } from '../services/tokenStorage';
import { ApiError } from '../types/ApiError';
import { AxiosError } from 'axios';
import { handleSuccess, handleApiError } from '../utils/notificationHandlers';
import { useEffect } from 'react';
import { ERROR_MESSAGES } from '../utils/messages';
import { notification } from 'antd';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const handleSignInError = (error: AxiosError<ApiError>) => {
    // Check for JWT signature error
    if (error?.message?.includes('JWT signature')) {
      tokenStorage.clearTokens();
      notification.error({
        message: 'Lỗi',
        description: ERROR_MESSAGES.JWT_EXPIRED
      });
    }
  };

  const signUpMutation = useMutation<AuthResponse, AxiosError<ApiError>, SignUpDto>({
    mutationFn: async (signUpDto) => {
      const response = await authService.signUp(signUpDto);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      handleSuccess('SIGN_UP');
    },
    onError: handleApiError
  });

  const signInMutation = useMutation<AuthResponse, AxiosError<ApiError>, SignInDto & { rememberMe?: boolean }>({
    mutationFn: authService.signIn,
    onSuccess: (data) => {
      tokenStorage.clearTokens();

      queryClient.setQueryData(['user'], data.user);
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      handleSuccess('SIGN_IN');
    },
    onError: (error) => {
      handleSignInError(error);
      handleApiError(error);
      tokenStorage.clearRememberedLogin();
    }
  });

  const signOutMutation = useMutation<void, AxiosError<ApiError>, void>({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.removeQueries();
      handleSuccess('SIGN_OUT');

      // // Clear all tokens
      // tokenStorage.clearTokens();
      // // Clear all query cache
      // queryClient.clear();
      // // Remove specific queries if needed
      // queryClient.removeQueries(['user']);
      // // Show success message
      // handleSuccess('SIGN_OUT');
    },
    onError: handleApiError
  });

  const refreshTokenMutation = useMutation<AuthResponse, AxiosError<ApiError>, void>({
    mutationFn: authService.refreshToken,
    retry: 2,
    onError: (error) => {
      handleApiError(error);
      tokenStorage.clearTokens();
      queryClient.clear();
      window.location.href = '/login'; // Force redirect to login
    }
  });

  const sendOtpMutation = useMutation<void, AxiosError<ApiError>, PhoneNumberDto>({
    mutationFn: async (phoneNumberDto) => {
      await authService.sendOtp(phoneNumberDto);
    },
    onSuccess: () => {
      handleSuccess('SEND_OTP');
    },
    onError: handleApiError
  });

  const forgotPasswordMutation = useMutation<void, AxiosError<ApiError>, PhoneNumberDto>({
    mutationFn: async (phoneNumberDto) => {
      await authService.forgotPassword(phoneNumberDto);
    },
    onSuccess: () => {
      handleSuccess('SEND_OTP');
    },
    onError: handleApiError
  });

  const resetPasswordMutation = useMutation<void, AxiosError<ApiError>, ResetPasswordDto>({
    mutationFn: async (resetPasswordDto) => {
      await authService.resetPassword(resetPasswordDto);
    },
    onSuccess: () => {
      handleSuccess('RESET_PASSWORD');
    },
    onError: handleApiError
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const token = tokenStorage.getAccessToken();
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const timeUntilExpiry = decoded.exp * 1000 - Date.now();
          if (timeUntilExpiry < 300000) { // 5 mins before expiry
            refreshTokenMutation.mutate();
          }
        } catch {
          tokenStorage.clearTokens();
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refreshTokenMutation]);

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    sendOtp: sendOtpMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    isSignUpLoading: signUpMutation.isPending,
    isSignInLoading: signInMutation.isPending,
    isSignOutLoading: signOutMutation.isPending,
    isRefreshingToken: refreshTokenMutation.isPending,
    isOtpLoading: sendOtpMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,

    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
    signOutError: signOutMutation.error,
    refreshTokenError: refreshTokenMutation.error,
    otpError: sendOtpMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,

    isAuthenticated: !!tokenStorage.getAccessToken(),
    user: queryClient.getQueryData<User>(['user']),
  };
};