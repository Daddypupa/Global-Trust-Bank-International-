import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../types/index.js';

export const authController = {
  register: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      throw new AppError(400, 'Missing required fields');
    }

    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: result,
    };

    res.status(201).json(response);
  }),

  login: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const result = await authService.login(email, password);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Login successful',
      data: result,
    };

    res.status(200).json(response);
  }),

  logout: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    await authService.logout(req.user.id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Logout successful',
    };

    res.status(200).json(response);
  }),

  forgotPassword: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    await authService.forgotPassword(email);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password reset link sent to your email',
    };

    res.status(200).json(response);
  }),

  resetPassword: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError(400, 'Token and password are required');
    }

    await authService.resetPassword(token, password);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password reset successful',
    };

    res.status(200).json(response);
  }),

  verifyEmail: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { token } = req.body;

    if (!token) {
      throw new AppError(400, 'Verification token is required');
    }

    await authService.verifyEmail(token);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Email verified successfully',
    };

    res.status(200).json(response);
  }),

  refreshToken: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(400, 'Refresh token is required');
    }

    const result = await authService.refreshToken(refreshToken);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    };

    res.status(200).json(response);
  }),

  enable2FA: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const result = await authService.enable2FA(req.user.id);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: '2FA enabled. Save your secret key and scan the QR code.',
      data: result,
    };

    res.status(200).json(response);
  }),

  verify2FA: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { code } = req.body;

    if (!code) {
      throw new AppError(400, '2FA code is required');
    }

    const result = await authService.verify2FA(req.user.id, code);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: '2FA verified successfully',
      data: result,
    };

    res.status(200).json(response);
  }),
};
