import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(authMiddleware);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);

// KYC routes
router.get('/kyc/status', userController.getKYCStatus);
router.post('/kyc/upload', userController.uploadKYC);
router.get('/kyc/history', userController.getKYCHistory);

// Settings
router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

export default router;
