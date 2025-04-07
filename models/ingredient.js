import mongoose from "mongoose"

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Protein", "Vegetable", "Fruit", "Grain", "Dairy", "Spice", "Other"],
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  commonUses: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt timestamp before saving
ingredientSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const Ingredient = mongoose.model("Ingredient", ingredientSchema)

export default Ingredient

