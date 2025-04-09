import request from "supertest"
import mongoose from "mongoose"
import { app, connectDB } from "../server.js"
import Recipe from "../models/recipe.js"
import User from "../models/user.js"
import jwt from "jsonwebtoken"

describe("Recipe API Routes", () => {
  let testUser
  let authToken

  beforeAll(async () => {
    await connectDB()

    testUser = new User({
      username: "recipeuser",
      email: "recipe@example.com",
      password: "password123",
    })
    await testUser.save()

    authToken = jwt.sign({ id: testUser._id, email: testUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
  })

  afterAll(async () => {
    await User.findByIdAndDelete(testUser._id)

    await mongoose.connection.close()
  })

  describe("GET /api/recipes", () => {
    it("should get all recipes", async () => {
      const response = await request(app).get("/api/recipes")
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe("GET /api/recipes/:id", () => {
    it("should get a recipe by ID", async () => {
      // First create a recipe to test with
      const testRecipe = new Recipe({
        title: "Test Recipe",
        description: "This is a test recipe",
        ingredients: ["Ingredient 1", "Ingredient 2"],
        instructions: ["Step 1", "Step 2"],
        cookingTime: 30,
        userId: testUser._id,
      })
      await testRecipe.save()

      const response = await request(app).get(`/api/recipes/${testRecipe._id}`)
      expect(response.status).toBe(200)
      expect(response.body.title).toBe("Test Recipe")

      await Recipe.findByIdAndDelete(testRecipe._id)
    })

    it("should return 404 for non-existent recipe", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const response = await request(app).get(`/api/recipes/${nonExistentId}`)
      expect(response.status).toBe(404)
    })
  })
})
