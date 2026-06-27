import prisma from '../config/database.js';
import { generateReferenceId } from '../utils/hash.js';
import { AppError } from '../middleware/errorHandler.js';

export const walletService = {
  getBalance: async (userId: string, currency: string) => {
    const wallet = await prisma.wallet.findFirst({
      where: {
        userId,
        currency,
      },
    });

    if (!wallet) {
      throw new AppError(404, `Wallet not found for currency ${currency}`);
    }

    return {
      currency: wallet.currency,
      balance: wallet.balance,
      availableBalance: wallet.availableBalance,
      pendingBalance: wallet.pendingBalance,
    };
  },

  getAllWallets: async (userId: string) => {
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      select: {
        id: true,
        currency: true,
        balance: true,
        availableBalance: true,
        pendingBalance: true,
      },
    });

    return wallets;
  },

  deposit: async (userId: string, amount: number, currency: string) => {
    if (amount <= 0) {
      throw new AppError(400, 'Amount must be greater than 0');
    }

    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet) {
      throw new AppError(404, `Wallet not found for currency ${currency}`);
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // Update wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: amount,
          },
          availableBalance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const txn = await tx.transaction.create({
        data: {
          referenceId: generateReferenceId(),
          senderId: userId,
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount,
          currency,
          status: 'COMPLETED',
          description: `Deposit of ${amount} ${currency}`,
        },
      });

      return { wallet: updatedWallet, transaction: txn };
    });

    return {
      transactionId: transaction.transaction.referenceId,
      walletBalance: transaction.wallet.balance,
      amount,
      currency,
    };
  },

  withdraw: async (userId: string, amount: number, currency: string) => {
    if (amount <= 0) {
      throw new AppError(400, 'Amount must be greater than 0');
    }

    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet) {
      throw new AppError(404, `Wallet not found for currency ${currency}`);
    }

    if (wallet.availableBalance < amount) {
      throw new AppError(400, 'Insufficient balance');
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // Update wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: amount,
          },
          availableBalance: {
            decrement: amount,
          },
        },
      });

      // Create transaction record
      const txn = await tx.transaction.create({
        data: {
          referenceId: generateReferenceId(),
          senderId: userId,
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount,
          currency,
          status: 'COMPLETED',
          description: `Withdrawal of ${amount} ${currency}`,
        },
      });

      return { wallet: updatedWallet, transaction: txn };
    });

    return {
      transactionId: transaction.transaction.referenceId,
      walletBalance: transaction.wallet.balance,
      amount,
      currency,
    };
  },

  transfer: async (
    senderId: string,
    recipientEmail: string,
    amount: number,
    currency: string,
    description?: string,
  ) => {
    if (amount <= 0) {
      throw new AppError(400, 'Amount must be greater than 0');
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      throw new AppError(404, 'Sender not found');
    }

    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail },
    });

    if (!recipient) {
      throw new AppError(404, 'Recipient not found');
    }

    const senderWallet = await prisma.wallet.findFirst({
      where: { userId: senderId, currency },
    });

    if (!senderWallet) {
      throw new AppError(404, 'Sender wallet not found');
    }

    if (senderWallet.availableBalance < amount) {
      throw new AppError(400, 'Insufficient balance');
    }

    const recipientWallet = await prisma.wallet.findFirst({
      where: { userId: recipient.id, currency },
    });

    if (!recipientWallet) {
      throw new AppError(404, 'Recipient wallet not found');
    }

    const transfer = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balance: {
            decrement: amount,
          },
          availableBalance: {
            decrement: amount,
          },
        },
      });

      // Add to recipient
      await tx.wallet.update({
        where: { id: recipientWallet.id },
        data: {
          balance: {
            increment: amount,
          },
          availableBalance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const referenceId = generateReferenceId();
      const txn = await tx.transaction.create({
        data: {
          referenceId,
          senderId,
          receiverId: recipient.id,
          walletId: senderWallet.id,
          type: 'TRANSFER',
          amount,
          currency,
          status: 'COMPLETED',
          description: description || `Transfer to ${recipient.email}`,
        },
      });

      return txn;
    });

    return {
      transactionId: transfer.referenceId,
      amount,
      currency,
      recipient: recipient.email,
      status: transfer.status,
    };
  },

  getWalletHistory: async (
    userId: string,
    currency: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet) {
      throw new AppError(404, `Wallet not found for currency ${currency}`);
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          walletId: wallet.id,
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
          walletId: wallet.id,
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
};
