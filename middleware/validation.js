import { body } from "express-validator"
import mongoose from "mongoose"

// User validation rules
export const validateUser = [
  body("username").isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters").trim(),
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

// Recipe validation rules
export const validateRecipe = [
  body("title").isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters").trim(),
  body("description").isLength({ min: 10 }).withMessage("Description must be at least 10 characters long").trim(),
  body("ingredients").isArray({ min: 1 }).withMessage("At least one ingredient is required"),
  body("instructions").isArray({ min: 1 }).withMessage("At least one instruction is required"),
  body("cookingTime").isInt({ min: 1 }).withMessage("Cooking time must be a positive number"),
]

// Ingredient validation rules
export const validateIngredient = [
  body("name").isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters").trim(),
  body("category")
    .isIn(["Protein", "Vegetable", "Fruit", "Grain", "Dairy", "Spice", "Other"])
    .withMessage("Category must be one of: Protein, Vegetable, Fruit, Grain, Dairy, Spice, Other"),
]

// Favorite validation rules
export const validateFavorite = [
  body("recipeId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid recipe ID")
    }
    return true
  }),
  body("notes").optional().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters").trim(),
]

