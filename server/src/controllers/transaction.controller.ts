import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { transactionService } from '../services/transaction.service.js';
import { ApiResponse } from '../types/index.js';

export const transactionController = {
  getTransactions: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { page = 1, limit = 20 } = req.query;

    const transactions = await transactionService.getUserTransactions(
      req.user.id,
      parseInt(page as string),
      parseInt(limit as string),
    );

    const response: ApiResponse<typeof transactions> = {
      success: true,
      message: 'Transactions retrieved',
      data: transactions,
    };

    res.status(200).json(response);
  }),

  getTransaction: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    const transaction = await transactionService.getTransactionById(req.user.id, id);

    const response: ApiResponse<typeof transaction> = {
      success: true,
      message: 'Transaction retrieved',
      data: transaction,
    };

    res.status(200).json(response);
  }),

  searchTransactions: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { type, status, currency, startDate, endDate } = req.body;

    const results = await transactionService.searchTransactions(req.user.id, {
      type,
      status,
      currency,
      startDate,
      endDate,
    });

    const response: ApiResponse<typeof results> = {
      success: true,
      message: 'Search results retrieved',
      data: results,
    };

    res.status(200).json(response);
  }),

  generateReceipt: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    const receipt = await transactionService.generateReceipt(req.user.id, id);

    const response: ApiResponse<typeof receipt> = {
      success: true,
      message: 'Receipt generated',
      data: receipt,
    };

    res.status(200).json(response);
  }),
};
