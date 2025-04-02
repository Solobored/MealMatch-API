import Recipe from '../models/recipe.model.js';

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      ingredients, 
      instructions, 
      prepTime, 
      cookTime, 
      servings, 
      difficulty, 
      imageUrl, 
      tags 
    } = req.body;
    
    const recipe = new Recipe({
      name,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      imageUrl,
      tags,
      createdBy: req.user ? req.user.id : null
    });
    
    await recipe.save();
    
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const { 
      search, 
      difficulty, 
      tags, 
      ingredients, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const query = {};
    
    // Search by text
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Filter by ingredients
    if (ingredients) {
      const ingredientArray = ingredients.split(',');
      query['ingredients.name'] = { $in: ingredientArray };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const recipes = await Recipe.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    const total = await Recipe.countDocuments(query);
    
    res.status(200).json({
      recipes,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalRecipes: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('createdBy', 'username');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      ingredients, 
      instructions, 
      prepTime, 
      cookTime, 
      servings, 
      difficulty, 
      imageUrl, 
      tags 
    } = req.body;
    
    const recipe = await Recipe.findById(req.params.recipeId);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user is the creator of the recipe
    if (req.user && recipe.createdBy && recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }
    
    // Update fields
    if (name) recipe.name = name;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (prepTime) recipe.prepTime = prepTime;
    if (cookTime) recipe.cookTime = cookTime;
    if (servings) recipe.servings = servings;
    if (difficulty) recipe.difficulty = difficulty;
    if (imageUrl) recipe.imageUrl = imageUrl;
    if (tags) recipe.tags = tags;
    
    await recipe.save();
    
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user is the creator of the recipe
    if (req.user && recipe.createdBy && recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    
    await Recipe.deleteOne({ _id: req.params.recipeId });
    
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};