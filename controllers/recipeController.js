import Recipe from "../models/recipe.js"
import { validationResult } from "express-validator"

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("userId", "username")
    res.status(200).json(recipes)
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error: error.message })
  }
}

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("userId", "username")
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }
    res.status(200).json(recipe)
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error: error.message })
  }
}

// Create new recipe
export const createRecipe = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const newRecipe = new Recipe({
      ...req.body,
      userId: req.user.id, // Set the userId to the authenticated user's ID
    })

    const savedRecipe = await newRecipe.save()
    res.status(201).json(savedRecipe)
  } catch (error) {
    res.status(500).json({ message: "Error creating recipe", error: error.message })
  }
}

// Update recipe
export const updateRecipe = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    // Check if user is the creator of the recipe
    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this recipe" })
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    res.status(200).json(updatedRecipe)
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe", error: error.message })
  }
}

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    // Check if user is the creator of the recipe
    if (recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" })
    }

    await Recipe.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Recipe deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe", error: error.message })
  }
}

// Search recipes
export const searchRecipes = async (req, res) => {
  try {
    const { query, tags, difficulty } = req.query

    // Build search criteria
    const searchCriteria = {}

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { ingredients: { $elemMatch: { $regex: query, $options: "i" } } },
      ]
    }

    if (tags) {
      searchCriteria.tags = { $in: Array.isArray(tags) ? tags : [tags] }
    }

    if (difficulty) {
      searchCriteria.difficulty = difficulty
    }

    const recipes = await Recipe.find(searchCriteria).populate("userId", "username")
    res.status(200).json(recipes)
  } catch (error) {
    res.status(500).json({ message: "Error searching recipes", error: error.message })
  }
}

