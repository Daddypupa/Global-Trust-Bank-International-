import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const transactionService = {
  getUserTransactions: async (userId: string, page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        select: {
          id: true,
          referenceId: true,
          type: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          timestamp: true,
          sender: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          receiver: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
      }),
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

  getTransactionById: async (userId: string, transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    // Verify user is part of this transaction
    if (transaction.senderId !== userId && transaction.receiverId !== userId) {
      throw new AppError(403, 'Unauthorized to view this transaction');
    }

    return transaction;
  },

  searchTransactions: async (
    userId: string,
    filters: {
      type?: string;
      status?: string;
      currency?: string;
      startDate?: string;
      endDate?: string;
    },
  ) => {
    const where: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.currency) {
      where.currency = filters.currency;
    }

    if (filters.startDate && filters.endDate) {
      where.timestamp = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        id: true,
        referenceId: true,
        type: true,
        amount: true,
        currency: true,
        status: true,
        timestamp: true,
        sender: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return { count: transactions.length, transactions };
  },

  generateReceipt: async (userId: string, transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        sender: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    if (transaction.senderId !== userId && transaction.receiverId !== userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const receipt = {
      receiptNumber: `RCP-${transaction.referenceId}`,
      transactionId: transaction.referenceId,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      date: transaction.timestamp,
      sender: transaction.sender,
      receiver: transaction.receiver,
      description: transaction.description,
      generatedAt: new Date(),
    };

    return receipt;
  },
};
