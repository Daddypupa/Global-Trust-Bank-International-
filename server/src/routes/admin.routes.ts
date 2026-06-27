import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User Management
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/freeze', adminController.freezeAccount);
router.post('/users/:id/unfreeze', adminController.unfreezeAccount);

// Wallet Management
router.post('/wallet/:userId/credit', adminController.creditWallet);
router.post('/wallet/:userId/debit', adminController.debitWallet);

// KYC Management
router.get('/kyc', adminController.getKYCRequests);
router.get('/kyc/:id', adminController.getKYCDetail);
router.post('/kyc/:id/approve', adminController.approveKYC);
router.post('/kyc/:id/reject', adminController.rejectKYC);

// Reports & Logs
router.get('/transactions', adminController.getTransactions);
router.get('/reports/daily', adminController.getDailyReport);
router.get('/reports/monthly', adminController.getMonthlyReport);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
