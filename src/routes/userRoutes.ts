import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  createAdmin,
  createVerifier,
  deleteUser
} from '../controllers/userController';
import { UserRole } from '../models/User';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);

// Admin only routes
router.use(authorize(UserRole.ADMIN));
router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .delete(deleteUser);

router.post(
  '/admin',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  createAdmin
);

router.post(
  '/verifier',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  createVerifier
);

export default router;