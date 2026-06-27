import prisma from '../config/database.js';
import { hashPassword } from '../utils/hash.js';
import { AppError } from '../middleware/errorHandler.js';

export const adminService = {
  getDashboard: async () => {
    const [totalUsers, totalTransactions, totalDeposits, totalWithdrawals, activeAccounts] =
      await Promise.all([
        prisma.user.count(),
        prisma.transaction.count(),
        prisma.transaction.aggregate({
          where: { type: 'DEPOSIT' },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { type: 'WITHDRAWAL' },
          _sum: { amount: true },
        }),
        prisma.user.count({
          where: { accountStatus: 'ACTIVE' },
        }),
      ]);

    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        sender: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    return {
      stats: {
        totalUsers,
        totalTransactions,
        totalDeposits: totalDeposits._sum.amount || 0,
        totalWithdrawals: totalWithdrawals._sum.amount || 0,
        activeAccounts,
      },
      recentTransactions,
    };
  },

  listUsers: async (page: number = 1, limit: number = 20, search?: string) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          verified: true,
          kycStatus: true,
          accountStatus: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getUser: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: true,
        kyc: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  },

  createUser: async (data: any) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || 'USER',
        verified: true,
      },
    });

    // Create default wallets
    await Promise.all([
      prisma.wallet.create({
        data: { userId: user.id, currency: 'USD' },
      }),
      prisma.wallet.create({
        data: { userId: user.id, currency: 'EUR' },
      }),
      prisma.wallet.create({
        data: { userId: user.id, currency: 'GBP' },
      }),
    ]);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },

  updateUser: async (userId: string, data: any) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        role: data.role || undefined,
      },
    });

    return user;
  },

  deleteUser: async (userId: string) => {
    await prisma.user.delete({
      where: { id: userId },
    });
  },

  freezeAccount: async (userId: string) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'FROZEN' },
    });

    return user;
  },

  unfreezeAccount: async (userId: string) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'ACTIVE' },
    });

    return user;
  },

  creditWallet: async (userId: string, amount: number, currency: string, reason?: string) => {
    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
        availableBalance: { increment: amount },
      },
    });

    return updatedWallet;
  },

  debitWallet: async (userId: string, amount: number, currency: string, reason?: string) => {
    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    if (wallet.availableBalance < amount) {
      throw new AppError(400, 'Insufficient balance');
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        availableBalance: { decrement: amount },
      },
    });

    return updatedWallet;
  },

  getKYCRequests: async (page: number = 1, limit: number = 20, status?: string) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [kyc, total] = await Promise.all([
      prisma.kyc.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.kyc.count({ where }),
    ]);

    return {
      kyc,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getKYCDetail: async (kycId: string) => {
    const kyc = await prisma.kyc.findUnique({
      where: { id: kycId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!kyc) {
      throw new AppError(404, 'KYC not found');
    }

    return kyc;
  },

  approveKYC: async (kycId: string, adminId?: string) => {
    const kyc = await prisma.kyc.update({
      where: { id: kycId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });

    // Update user KYC status
    await prisma.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: 'APPROVED' },
    });

    return kyc;
  },

  rejectKYC: async (kycId: string, reason: string, adminId?: string) => {
    const kyc = await prisma.kyc.update({
      where: { id: kycId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });

    // Update user KYC status
    await prisma.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: 'REJECTED' },
    });

    return kyc;
  },

  getTransactions: async (
    page: number = 1,
    limit: number = 20,
    status?: string,
    type?: string,
  ) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          sender: { select: { email: true, firstName: true, lastName: true } },
          receiver: { select: { email: true, firstName: true, lastName: true } },
        },
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getDailyReport: async (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const transactions = await prisma.transaction.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const report = {
      date: startOfDay.toISOString().split('T')[0],
      totalTransactions: transactions.length,
      deposits: transactions
        .filter((t) => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0),
      withdrawals: transactions
        .filter((t) => t.type === 'WITHDRAWAL')
        .reduce((sum, t) => sum + t.amount, 0),
      transfers: transactions
        .filter((t) => t.type === 'TRANSFER')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    return report;
  },

  getMonthlyReport: async (month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const report = {
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalTransactions: transactions.length,
      deposits: transactions
        .filter((t) => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0),
      withdrawals: transactions
        .filter((t) => t.type === 'WITHDRAWAL')
        .reduce((sum, t) => sum + t.amount, 0),
      transfers: transactions
        .filter((t) => t.type === 'TRANSFER')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    return report;
  },

  getAuditLogs: async (page: number = 1, limit: number = 50) => {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};
