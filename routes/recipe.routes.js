import express from 'express';
import { 
  createRecipe, 
  getRecipes, 
  getRecipeById, 
  updateRecipe, 
  deleteRecipe 
} from '../controllers/recipe.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRecipeInput } from '../middleware/validate.middleware.js';

const router = express.Router();

// POST /api/recipes - Create a new recipe
router.post('/', protect, validateRecipeInput, createRecipe);

// GET /api/recipes - Get all recipes
router.get('/', getRecipes);

// GET /api/recipes/:recipeId - Get recipe by ID
router.get('/:recipeId', getRecipeById);

// PUT /api/recipes/:recipeId - Update recipe
router.put('/:recipeId', protect, validateRecipeInput, updateRecipe);

// DELETE /api/recipes/:recipeId - Delete recipe
router.delete('/:recipeId', protect, deleteRecipe);

export default router;