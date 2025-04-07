import mongoose from "mongoose"

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
})

// Create a compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true })

const Favorite = mongoose.model("Favorite", favoriteSchema)

export default Favorite

