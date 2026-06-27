import prisma from '../config/database.js';
import { comparePassword, hashPassword } from '../utils/hash.js';
import { AppError } from '../middleware/errorHandler.js';

export const userService = {
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        verified: true,
        kycStatus: true,
        accountStatus: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  },

  updateProfile: async (userId: string, data: any) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        avatar: data.avatar || undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    return updatedUser;
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError(400, 'Current password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  getKYCStatus: async (userId: string) => {
    const kyc = await prisma.kyc.findUnique({
      where: { userId },
    });

    if (!kyc) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'KYC not submitted yet',
      };
    }

    return {
      status: kyc.status,
      submittedAt: kyc.submittedAt,
      rejectionReason: kyc.rejectionReason,
    };
  },

  uploadKYC: async (userId: string, data: any) => {
    const existingKYC = await prisma.kyc.findUnique({
      where: { userId },
    });

    if (existingKYC && existingKYC.status === 'APPROVED') {
      throw new AppError(400, 'KYC already approved');
    }

    let kyc;

    if (existingKYC) {
      kyc = await prisma.kyc.update({
        where: { userId },
        data: {
          documentType: data.documentType,
          documentUrl: data.documentUrl,
          selfieUrl: data.selfieUrl,
          addressProofUrl: data.addressProofUrl,
          status: 'PENDING',
        },
      });
    } else {
      kyc = await prisma.kyc.create({
        data: {
          userId,
          documentType: data.documentType,
          documentUrl: data.documentUrl,
          selfieUrl: data.selfieUrl,
          addressProofUrl: data.addressProofUrl,
        },
      });
    }

    return kyc;
  },

  getKYCHistory: async (userId: string) => {
    const kyc = await prisma.kyc.findUnique({
      where: { userId },
      select: {
        status: true,
        submittedAt: true,
        reviewedAt: true,
        rejectionReason: true,
      },
    });

    return kyc || { message: 'No KYC history found' };
  },

  getSettings: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorEnabled: true,
      },
    });

    return user;
  },

  updateSettings: async (userId: string, data: any) => {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: data.twoFactorEnabled || undefined,
      },
      select: {
        twoFactorEnabled: true,
      },
    });

    return updated;
  },
};
