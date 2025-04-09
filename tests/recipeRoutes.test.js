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
    // Connect to test database
    await connectDB()

    // Clean up any existing test users first
    await User.deleteOne({ email: "recipe@example.com" })

    // Create a test user
    testUser = new User({
      username: "recipeuser",
      email: "recipe@example.com",
      password: "password123",
    })
    await testUser.save()

    // Generate auth token
    authToken = jwt.sign({ id: testUser._id, email: testUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
  })

  afterAll(async () => {
    // Clean up
    if (testUser && testUser._id) {
      await User.findByIdAndDelete(testUser._id)
    }

    // Disconnect from test database
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
    let testRecipe

    beforeEach(async () => {
      // Create a test recipe
      testRecipe = new Recipe({
        title: "Test Recipe",
        description: "This is a test recipe",
        ingredients: ["Ingredient 1", "Ingredient 2"],
        instructions: ["Step 1", "Step 2"],
        cookingTime: 30,
        userId: testUser._id,
      })
      await testRecipe.save()
    })

    afterEach(async () => {
      // Clean up
      if (testRecipe && testRecipe._id) {
        await Recipe.findByIdAndDelete(testRecipe._id)
      }
    })

    it("should get a recipe by ID", async () => {
      const response = await request(app).get(`/api/recipes/${testRecipe._id}`)
      expect(response.status).toBe(200)
      expect(response.body.title).toBe("Test Recipe")
    })

    it("should return 404 for non-existent recipe", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const response = await request(app).get(`/api/recipes/${nonExistentId}`)
      expect(response.status).toBe(404)
    })
  })
})
