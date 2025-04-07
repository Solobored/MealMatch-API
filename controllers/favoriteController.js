import Favorite from "../models/favorite.js"
import { validationResult } from "express-validator"

// Get all favorites for a user
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id // Get user ID from authenticated request
    const favorites = await Favorite.find({ userId }).populate("recipeId").sort({ createdAt: -1 })

    res.status(200).json(favorites)
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error: error.message })
  }
}

// Get favorite by ID
export const getFavoriteById = async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id).populate("recipeId")

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    // Check if the favorite belongs to the authenticated user
    if (favorite.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this favorite" })
    }

    res.status(200).json(favorite)
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorite", error: error.message })
  }
}

// Add a recipe to favorites
export const addFavorite = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { recipeId, notes } = req.body
    const userId = req.user.id // Get user ID from authenticated request

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, recipeId })
    if (existingFavorite) {
      return res.status(400).json({ message: "Recipe already in favorites" })
    }

    const newFavorite = new Favorite({
      userId,
      recipeId,
      notes,
    })

    const savedFavorite = await newFavorite.save()
    res.status(201).json(savedFavorite)
  } catch (error) {
    res.status(500).json({ message: "Error adding favorite", error: error.message })
  }
}

// Update favorite notes
export const updateFavorite = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const favorite = await Favorite.findById(req.params.id)

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    // Check if the favorite belongs to the authenticated user
    if (favorite.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this favorite" })
    }

    favorite.notes = req.body.notes
    const updatedFavorite = await favorite.save()

    res.status(200).json(updatedFavorite)
  } catch (error) {
    res.status(500).json({ message: "Error updating favorite", error: error.message })
  }
}

// Remove a recipe from favorites
export const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id)

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    // Check if the favorite belongs to the authenticated user
    if (favorite.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this favorite" })
    }

    await Favorite.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Favorite removed successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error removing favorite", error: error.message })
  }
}

