import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(authMiddleware);

// Wallet routes
router.get('/balance', walletController.getBalance);
router.get('/all', walletController.getAllWallets);
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.post('/transfer', walletController.transfer);
router.get('/history/:currency', walletController.getWalletHistory);

export default router;
