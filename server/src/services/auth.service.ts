import prisma from '../config/database.js';
import { hashPassword, comparePassword, generateRandomToken } from '../utils/hash.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { email, password, firstName, lastName, phone } = payload;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(400, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateRandomToken();
    const verificationTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        verificationToken,
        verificationTokenExp,
      },
    });

    // Create default wallets for user
    await Promise.all([
      prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'USD',
          balance: 0,
          availableBalance: 0,
          pendingBalance: 0,
        },
      }),
      prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'EUR',
          balance: 0,
          availableBalance: 0,
          pendingBalance: 0,
        },
      }),
      prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'GBP',
          balance: 0,
          availableBalance: 0,
          pendingBalance: 0,
        },
      }),
    ]);

    // TODO: Send verification email with verificationToken

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      message: 'Verification email sent. Please check your inbox.',
    };
  },

  login: async (email: string, password: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.verified) {
      throw new AppError(403, 'Please verify your email before logging in');
    }

    if (user.accountStatus !== 'ACTIVE') {
      throw new AppError(403, 'Your account is not active');
    }

    // Generate tokens
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
      refreshToken,
    };
  },

  logout: async (userId: string) => {
    await prisma.session.deleteMany({
      where: { userId },
    });
  },

  forgotPassword: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    const resetToken = generateRandomToken();
    const resetTokenExp = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExp: resetTokenExp,
      },
    });

    // TODO: Send password reset email with resetToken
  },

  resetPassword: async (token: string, newPassword: string) => {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExp: null,
      },
    });
  },

  verifyEmail: async (token: string) => {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExp: null,
      },
    });
  },

  refreshToken: async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: { token: refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const newToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: newToken,
      refreshToken,
    };
  },

  enable2FA: async (userId: string) => {
    // TODO: Implement 2FA using speakeasy or similar library
    return {
      message: '2FA setup',
    };
  },

  verify2FA: async (userId: string, code: string) => {
    // TODO: Verify 2FA code
    return {
      message: '2FA verified',
    };
  },
};
