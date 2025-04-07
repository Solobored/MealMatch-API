import express from "express"
import {
  getUserFavorites,
  getFavoriteById,
  addFavorite,
  updateFavorite,
  deleteFavorite,
} from "../controllers/favoriteController.js"
import { validateFavorite } from "../middleware/validation.js"
import { authenticateJWT } from "../middleware/auth.js"

const router = express.Router()

// All favorite routes require authentication
router.use(authenticateJWT)

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorites for the authenticated user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's favorites
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", getUserFavorites)

/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     summary: Get favorite by ID
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getFavoriteById)

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a recipe to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *             properties:
 *               recipeId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe added to favorites
 *       400:
 *         description: Validation error or already in favorites
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", validateFavorite, addFavorite)

/**
 * @swagger
 * /api/favorites/{id}:
 *   put:
 *     summary: Update favorite notes
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorite updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.put("/:id", validateFavorite, updateFavorite)

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Remove a recipe from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteFavorite)

export default router

