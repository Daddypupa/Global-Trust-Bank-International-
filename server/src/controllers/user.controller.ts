import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { userService } from '../services/user.service.js';
import { ApiResponse } from '../types/index.js';

export const userController = {
  getProfile: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const profile = await userService.getProfile(req.user.id);

    const response: ApiResponse<typeof profile> = {
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    };

    res.status(200).json(response);
  }),

  updateProfile: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { firstName, lastName, phone, avatar } = req.body;

    const updatedProfile = await userService.updateProfile(req.user.id, {
      firstName,
      lastName,
      phone,
      avatar,
    });

    const response: ApiResponse<typeof updatedProfile> = {
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    };

    res.status(200).json(response);
  }),

  changePassword: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(400, 'Current and new passwords are required');
    }

    await userService.changePassword(req.user.id, currentPassword, newPassword);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password changed successfully',
    };

    res.status(200).json(response);
  }),

  getKYCStatus: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const kycStatus = await userService.getKYCStatus(req.user.id);

    const response: ApiResponse<typeof kycStatus> = {
      success: true,
      message: 'KYC status retrieved',
      data: kycStatus,
    };

    res.status(200).json(response);
  }),

  uploadKYC: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { documentType, documentUrl, selfieUrl, addressProofUrl } = req.body;

    if (!documentType || !documentUrl || !selfieUrl || !addressProofUrl) {
      throw new AppError(400, 'All KYC documents are required');
    }

    const kyc = await userService.uploadKYC(req.user.id, {
      documentType,
      documentUrl,
      selfieUrl,
      addressProofUrl,
    });

    const response: ApiResponse<typeof kyc> = {
      success: true,
      message: 'KYC documents uploaded successfully',
      data: kyc,
    };

    res.status(201).json(response);
  }),

  getKYCHistory: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const history = await userService.getKYCHistory(req.user.id);

    const response: ApiResponse<typeof history> = {
      success: true,
      message: 'KYC history retrieved',
      data: history,
    };

    res.status(200).json(response);
  }),

  getSettings: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const settings = await userService.getSettings(req.user.id);

    const response: ApiResponse<typeof settings> = {
      success: true,
      message: 'Settings retrieved',
      data: settings,
    };

    res.status(200).json(response);
  }),

  updateSettings: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const settings = await userService.updateSettings(req.user.id, req.body);

    const response: ApiResponse<typeof settings> = {
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    };

    res.status(200).json(response);
  }),
};
