import express from "express"
import userRoutes from "./userRoutes.js"
import recipeRoutes from "./recipeRoutes.js"
import ingredientRoutes from "./ingredientRoutes.js"
import favoriteRoutes from "./favoriteRoutes.js"
import authRoutes from "./authRoutes.js"

const router = express.Router()

// Mount routes
router.use("/users", userRoutes)
router.use("/recipes", recipeRoutes)
router.use("/ingredients", ingredientRoutes)
router.use("/favorites", favoriteRoutes)
router.use("/auth", authRoutes)

export default router

