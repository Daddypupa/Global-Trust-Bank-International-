import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(authMiddleware);

// Transaction routes
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.post('/search', transactionController.searchTransactions);
router.post('/:id/receipt', transactionController.generateReceipt);

export default router;
