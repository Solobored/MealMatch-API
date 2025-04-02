import express from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  loginUser 
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateUserInput } from '../middleware/validate.middleware.js';

const router = express.Router();

// POST /api/users - Create a new user
router.post('/', validateUserInput, createUser);

// POST /api/users/login - User login
router.post('/login', loginUser);

// GET /api/users - Get all users
router.get('/', protect, getUsers);

// GET /api/users/:userId - Get user by ID
router.get('/:userId', protect, getUserById);

// PUT /api/users/:userId - Update user
router.put('/:userId', protect, updateUser);

// DELETE /api/users/:userId - Delete user
router.delete('/:userId', protect, deleteUser);

export default router;