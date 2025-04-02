// Validation middleware for user input
export const validateUserInput = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];
  
  // Validate username
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  // Validate email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }
  
  // Validate password
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  next();
};

// Validation middleware for recipe input
export const validateRecipeInput = (req, res, next) => {
  const { name, ingredients, instructions } = req.body;
  const errors = [];
  
  // Validate recipe name
  if (!name || name.trim().length === 0) {
    errors.push('Recipe name is required');
  }
  
  // Validate ingredients
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  } else {
    // Check each ingredient has a name
    for (const ingredient of ingredients) {
      if (!ingredient.name || ingredient.name.trim().length === 0) {
        errors.push('Each ingredient must have a name');
        break;
      }
    }
  }
  
  // Validate instructions
  if (!instructions || !Array.isArray(instructions) || instructions.length === 0) {
    errors.push('Instructions are required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  next();
};