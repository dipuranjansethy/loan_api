import express from 'express';
import { body } from 'express-validator';
import {
  applyForLoan,
  getLoans,
  getLoan,
  verifyLoan,
  rejectLoan,
  approveLoan
} from '../controllers/loanController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all loans route - accessible by all authenticated users
router.get('/', getLoans);

// Get single loan - accessible by all authenticated users
router.get('/:id', getLoan);

// User only routes
router.post(
  '/',
  [
    body('amount', 'Amount is required and must be a number').isNumeric(),
    body('purpose', 'Purpose is required').not().isEmpty(),
    body('term', 'Term is required and must be a number').isNumeric(),
    body('fullName', 'Full name is required').not().isEmpty(),
    body('employmentStatus', 'Employment status is required').not().isEmpty(),
    body('employmentAddress', 'Employment address is required').not().isEmpty()
  ],
  authorize(UserRole.USER),
  applyForLoan
);

// Verifier routes
router.put('/:id/verify', authorize(UserRole.VERIFIER), verifyLoan);
router.put('/:id/reject', authorize(UserRole.VERIFIER, UserRole.ADMIN), rejectLoan);

// Admin only routes
router.put('/:id/approve', authorize(UserRole.ADMIN), approveLoan);

export default router;