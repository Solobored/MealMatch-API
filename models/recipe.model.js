import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: String,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    }
  }],
  instructions: {
    type: [String],
    required: [true, 'Instructions are required']
  },
  prepTime: {
    type: Number,
    min: 0
  },
  cookTime: {
    type: Number,
    min: 0
  },
  servings: {
    type: Number,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  imageUrl: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search functionality
recipeSchema.index({ name: 'text', description: 'text', 'ingredients.name': 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;