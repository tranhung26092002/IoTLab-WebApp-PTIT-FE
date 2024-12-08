import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api/authService';
import {
  SignInDto,
  SignUpDto,
  PhoneNumberDto,
  ResetPasswordDto,
  AuthResponse,
} from '../types/auth';
import { User } from '../types/user';
import { tokenStorage } from '../services/tokenStorage';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const signUpMutation = useMutation<AuthResponse, Error, SignUpDto>({
    mutationFn: async (signUpDto) => {
      const response = await authService.signUp(signUpDto);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
    },
    onError: (error) => {
      console.error('Sign up failed:', error);
    }
  });

  const signInMutation = useMutation<AuthResponse, Error, SignInDto>({
    mutationFn: authService.signIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    }
  });

  const signOutMutation = useMutation<void, Error, void>({
    mutationFn: () => {
      authService.signOut();
      queryClient.clear();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.removeQueries();
    }
  });

  const refreshTokenMutation = useMutation<AuthResponse, Error, void>({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      authService.setTokens(data.accessToken, data.refreshToken);
    },
    onError: () => {
      authService.signOut();
      queryClient.clear();
    }
  });

  const sendOtpMutation = useMutation<void, Error, PhoneNumberDto>({
    mutationFn: async (phoneNumberDto) => {
      await authService.sendOtp(phoneNumberDto);
    },
    onError: (error) => {
      console.error('Send OTP failed:', error);
    }
  });

  const forgotPasswordMutation = useMutation<void, Error, PhoneNumberDto>({
    mutationFn: async (phoneNumberDto) => {
      await authService.forgotPassword(phoneNumberDto);
    },
    onError: (error) => {
      console.error('Forgot password failed:', error);
    }
  });

  const resetPasswordMutation = useMutation<void, Error, ResetPasswordDto>({
    mutationFn: async (resetPasswordDto) => {
      await authService.resetPassword(resetPasswordDto);
    },
    onError: (error) => {
      console.error('Reset password failed:', error);
    }
  });

  return {
    // Auth actions
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    sendOtp: sendOtpMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    // Loading states
    isSignUpLoading: signUpMutation.isPending,
    isSignInLoading: signInMutation.isPending,
    isSignOutLoading: signOutMutation.isPending,
    isRefreshingToken: refreshTokenMutation.isPending,
    isOtpLoading: sendOtpMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,

    // Errors
    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
    signOutError: signOutMutation.error,
    refreshTokenError: refreshTokenMutation.error,
    otpError: sendOtpMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,

    // Auth state
    isAuthenticated: !!authService.getAccessToken(),
    user: queryClient.getQueryData<User>(['user']),

    // Helper methods
    getAccessToken: authService.getAccessToken,
    getRefreshToken: authService.getRefreshToken,
  };
};