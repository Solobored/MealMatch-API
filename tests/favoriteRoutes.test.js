import request from "supertest"
import mongoose from "mongoose"
import { app, connectDB } from "../server.js"
import Favorite from "../models/favorite.js"
import User from "../models/user.js"
import Recipe from "../models/recipe.js"
import jwt from "jsonwebtoken"
import { describe, expect, it, beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals"

describe("Favorite API Routes", () => {
  let testUser
  let testRecipe
  let authToken

  beforeAll(async () => {
    // Connect to test database
    await connectDB()

    // Clean up any existing test users first
    await User.deleteOne({ email: "favorite@example.com" })

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
    if (testUser && testUser._id) {
      await User.findByIdAndDelete(testUser._id)
    }

    if (testRecipe && testRecipe._id) {
      await Recipe.findByIdAndDelete(testRecipe._id)
    }

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
    let testFavorite

    beforeEach(async () => {
      // Create a test favorite
      testFavorite = new Favorite({
        userId: testUser._id,
        recipeId: testRecipe._id,
        notes: "Test favorite notes",
      })
      await testFavorite.save()
    })

    afterEach(async () => {
      // Clean up
      if (testFavorite && testFavorite._id) {
        await Favorite.findByIdAndDelete(testFavorite._id)
      }
    })

    it("should get a favorite by ID", async () => {
      const response = await request(app)
        .get(`/api/favorites/${testFavorite._id}`)
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.notes).toBe("Test favorite notes")
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
