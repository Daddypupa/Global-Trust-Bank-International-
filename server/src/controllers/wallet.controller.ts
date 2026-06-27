import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { walletService } from '../services/wallet.service.js';
import { ApiResponse } from '../types/index.js';

export const walletController = {
  getBalance: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { currency = 'USD' } = req.query;

    const balance = await walletService.getBalance(req.user.id, currency as string);

    const response: ApiResponse<typeof balance> = {
      success: true,
      message: 'Balance retrieved',
      data: balance,
    };

    res.status(200).json(response);
  }),

  getAllWallets: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const wallets = await walletService.getAllWallets(req.user.id);

    const response: ApiResponse<typeof wallets> = {
      success: true,
      message: 'Wallets retrieved',
      data: wallets,
    };

    res.status(200).json(response);
  }),

  deposit: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { amount, currency } = req.body;

    if (!amount || !currency) {
      throw new AppError(400, 'Amount and currency are required');
    }

    const result = await walletService.deposit(req.user.id, amount, currency);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Deposit successful',
      data: result,
    };

    res.status(201).json(response);
  }),

  withdraw: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { amount, currency } = req.body;

    if (!amount || !currency) {
      throw new AppError(400, 'Amount and currency are required');
    }

    const result = await walletService.withdraw(req.user.id, amount, currency);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Withdrawal successful',
      data: result,
    };

    res.status(201).json(response);
  }),

  transfer: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { recipientEmail, amount, currency, description } = req.body;

    if (!recipientEmail || !amount || !currency) {
      throw new AppError(400, 'Recipient email, amount, and currency are required');
    }

    const result = await walletService.transfer(
      req.user.id,
      recipientEmail,
      amount,
      currency,
      description,
    );

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Transfer successful',
      data: result,
    };

    res.status(201).json(response);
  }),

  getWalletHistory: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { currency } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const history = await walletService.getWalletHistory(
      req.user.id,
      currency,
      parseInt(page as string),
      parseInt(limit as string),
    );

    const response: ApiResponse<typeof history> = {
      success: true,
      message: 'Wallet history retrieved',
      data: history,
    };

    res.status(200).json(response);
  }),
};
