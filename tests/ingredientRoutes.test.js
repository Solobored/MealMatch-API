import request from "supertest"
import mongoose from "mongoose"
import app from "../server.js"
import Ingredient from "../models/ingredient.js"

describe("Ingredient API Routes", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close()
  })

  describe("GET /api/ingredients", () => {
    it("should get all ingredients", async () => {
      const response = await request(app).get("/api/ingredients")
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe("GET /api/ingredients/:id", () => {
    it("should get an ingredient by ID", async () => {
      // First create an ingredient to test with
      const testIngredient = new Ingredient({
        name: "Test Ingredient",
        category: "Vegetable",
        nutritionalInfo: {
          calories: 100,
          protein: 5,
          carbs: 10,
          fat: 2,
        },
        commonUses: ["Salads", "Soups"],
      })
      await testIngredient.save()

      const response = await request(app).get(`/api/ingredients/${testIngredient._id}`)
      expect(response.status).toBe(200)
      expect(response.body.name).toBe("Test Ingredient")
      expect(response.body.category).toBe("Vegetable")

      // Clean up
      await Ingredient.findByIdAndDelete(testIngredient._id)
    })

    it("should return 404 for non-existent ingredient", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const response = await request(app).get(`/api/ingredients/${nonExistentId}`)
      expect(response.status).toBe(404)
    })
  })
})

