import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/verify-email', authController.verifyEmail);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.post('/2fa/enable', authMiddleware, authController.enable2FA);
router.post('/2fa/verify', authMiddleware, authController.verify2FA);

export default router;
