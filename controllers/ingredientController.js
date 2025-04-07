import Ingredient from "../models/ingredient.js"
import { validationResult } from "express-validator"

// Get all ingredients
export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
    res.status(200).json(ingredients)
  } catch (error) {
    res.status(500).json({ message: "Error fetching ingredients", error: error.message })
  }
}

// Get ingredient by ID
export const getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" })
    }
    res.status(200).json(ingredient)
  } catch (error) {
    res.status(500).json({ message: "Error fetching ingredient", error: error.message })
  }
}

// Create new ingredient
export const createIngredient = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const newIngredient = new Ingredient(req.body)
    const savedIngredient = await newIngredient.save()
    res.status(201).json(savedIngredient)
  } catch (error) {
    res.status(500).json({ message: "Error creating ingredient", error: error.message })
  }
}

// Update ingredient
export const updateIngredient = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" })
    }

    res.status(200).json(updatedIngredient)
  } catch (error) {
    res.status(500).json({ message: "Error updating ingredient", error: error.message })
  }
}

// Delete ingredient
export const deleteIngredient = async (req, res) => {
  try {
    const deletedIngredient = await Ingredient.findByIdAndDelete(req.params.id)

    if (!deletedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" })
    }

    res.status(200).json({ message: "Ingredient deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting ingredient", error: error.message })
  }
}

