import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { adminService } from '../services/admin.service.js';
import { ApiResponse } from '../types/index.js';

export const adminController = {
  getDashboard: asyncHandler(async (req: AuthRequest, res: Response) => {
    const dashboard = await adminService.getDashboard();

    const response: ApiResponse<typeof dashboard> = {
      success: true,
      message: 'Dashboard data retrieved',
      data: dashboard,
    };

    res.status(200).json(response);
  }),

  listUsers: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20, search } = req.query;

    const users = await adminService.listUsers(
      parseInt(page as string),
      parseInt(limit as string),
      search as string,
    );

    const response: ApiResponse<typeof users> = {
      success: true,
      message: 'Users retrieved',
      data: users,
    };

    res.status(200).json(response);
  }),

  getUser: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await adminService.getUser(id);

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'User retrieved',
      data: user,
    };

    res.status(200).json(response);
  }),

  createUser: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, phone, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
      throw new AppError(400, 'Required fields missing');
    }

    const user = await adminService.createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
    });

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'User created successfully',
      data: user,
    };

    res.status(201).json(response);
  }),

  updateUser: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, phone, role } = req.body;

    const user = await adminService.updateUser(id, {
      firstName,
      lastName,
      phone,
      role,
    });

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'User updated successfully',
      data: user,
    };

    res.status(200).json(response);
  }),

  deleteUser: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    await adminService.deleteUser(id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'User deleted successfully',
    };

    res.status(200).json(response);
  }),

  freezeAccount: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await adminService.freezeAccount(id);

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'Account frozen successfully',
      data: user,
    };

    res.status(200).json(response);
  }),

  unfreezeAccount: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await adminService.unfreezeAccount(id);

    const response: ApiResponse<typeof user> = {
      success: true,
      message: 'Account unfrozen successfully',
      data: user,
    };

    res.status(200).json(response);
  }),

  creditWallet: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const { amount, currency, reason } = req.body;

    if (!amount || !currency) {
      throw new AppError(400, 'Amount and currency are required');
    }

    const result = await adminService.creditWallet(userId, amount, currency, reason);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Wallet credited successfully',
      data: result,
    };

    res.status(201).json(response);
  }),

  debitWallet: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const { amount, currency, reason } = req.body;

    if (!amount || !currency) {
      throw new AppError(400, 'Amount and currency are required');
    }

    const result = await adminService.debitWallet(userId, amount, currency, reason);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Wallet debited successfully',
      data: result,
    };

    res.status(201).json(response);
  }),

  getKYCRequests: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20, status } = req.query;

    const kyc = await adminService.getKYCRequests(
      parseInt(page as string),
      parseInt(limit as string),
      status as string,
    );

    const response: ApiResponse<typeof kyc> = {
      success: true,
      message: 'KYC requests retrieved',
      data: kyc,
    };

    res.status(200).json(response);
  }),

  getKYCDetail: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const kyc = await adminService.getKYCDetail(id);

    const response: ApiResponse<typeof kyc> = {
      success: true,
      message: 'KYC detail retrieved',
      data: kyc,
    };

    res.status(200).json(response);
  }),

  approveKYC: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user || {};

    const kyc = await adminService.approveKYC(id, userId);

    const response: ApiResponse<typeof kyc> = {
      success: true,
      message: 'KYC approved successfully',
      data: kyc,
    };

    res.status(200).json(response);
  }),

  rejectKYC: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const { userId } = req.user || {};

    if (!reason) {
      throw new AppError(400, 'Rejection reason is required');
    }

    const kyc = await adminService.rejectKYC(id, reason, userId);

    const response: ApiResponse<typeof kyc> = {
      success: true,
      message: 'KYC rejected successfully',
      data: kyc,
    };

    res.status(200).json(response);
  }),

  getTransactions: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20, status, type } = req.query;

    const transactions = await adminService.getTransactions(
      parseInt(page as string),
      parseInt(limit as string),
      status as string,
      type as string,
    );

    const response: ApiResponse<typeof transactions> = {
      success: true,
      message: 'Transactions retrieved',
      data: transactions,
    };

    res.status(200).json(response);
  }),

  getDailyReport: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { date } = req.query;

    const report = await adminService.getDailyReport(date as string);

    const response: ApiResponse<typeof report> = {
      success: true,
      message: 'Daily report retrieved',
      data: report,
    };

    res.status(200).json(response);
  }),

  getMonthlyReport: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { month, year } = req.query;

    const report = await adminService.getMonthlyReport(
      parseInt(month as string),
      parseInt(year as string),
    );

    const response: ApiResponse<typeof report> = {
      success: true,
      message: 'Monthly report retrieved',
      data: report,
    };

    res.status(200).json(response);
  }),

  getAuditLogs: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 50 } = req.query;

    const logs = await adminService.getAuditLogs(
      parseInt(page as string),
      parseInt(limit as string),
    );

    const response: ApiResponse<typeof logs> = {
      success: true,
      message: 'Audit logs retrieved',
      data: logs,
    };

    res.status(200).json(response);
  }),
};
