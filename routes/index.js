import express from 'express';
import userRoutes from './user.routes.js';
import recipeRoutes from './recipe.routes.js';

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/recipes', recipeRoutes);

export default router;