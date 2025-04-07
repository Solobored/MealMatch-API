import request from "supertest"
import mongoose from "mongoose"
import app from "../server.js"
import Favorite from "../models/favorite.js"
import User from "../models/user.js"
import Recipe from "../models/recipe.js"
import jwt from "jsonwebtoken"

describe("Favorite API Routes", () => {
  let testUser
  let testRecipe
  let authToken

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI)

    // Create a test user
    testUser = new User({
      username: "favoriteuser",
      email: "favorite@example.com",
      password: "password123",
    })
    await testUser.save()

    // Create a test recipe
    testRecipe = new Recipe({
      title: "Favorite Test Recipe",
      description: "This is a test recipe for favorites",
      ingredients: ["Ingredient 1", "Ingredient 2"],
      instructions: ["Step 1", "Step 2"],
      cookingTime: 30,
      userId: testUser._id,
    })
    await testRecipe.save()

    // Generate auth token
    authToken = jwt.sign({ id: testUser._id, email: testUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
  })

  afterAll(async () => {
    // Clean up
    await User.findByIdAndDelete(testUser._id)
    await Recipe.findByIdAndDelete(testRecipe._id)

    // Disconnect from test database
    await mongoose.connection.close()
  })

  describe("GET /api/favorites", () => {
    it("should get all favorites for authenticated user", async () => {
      const response = await request(app).get("/api/favorites").set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/favorites")
      expect(response.status).toBe(401)
    })
  })

  describe("GET /api/favorites/:id", () => {
    it("should get a favorite by ID", async () => {
      // First create a favorite to test with
      const testFavorite = new Favorite({
        userId: testUser._id,
        recipeId: testRecipe._id,
        notes: "Test favorite notes",
      })
      await testFavorite.save()

      const response = await request(app)
        .get(`/api/favorites/${testFavorite._id}`)
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.notes).toBe("Test favorite notes")

      // Clean up
      await Favorite.findByIdAndDelete(testFavorite._id)
    })

    it("should return 404 for non-existent favorite", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const response = await request(app)
        .get(`/api/favorites/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(404)
    })
  })
})

