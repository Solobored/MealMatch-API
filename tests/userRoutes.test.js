import request from "supertest"
import mongoose from "mongoose"
import app from "../server.js"
import User from "../models/user.js"

describe("User API Routes", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close()
  })

  describe("GET /api/users", () => {
    it("should get all users", async () => {
      const response = await request(app).get("/api/users")
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe("GET /api/users/:id", () => {
    it("should get a user by ID", async () => {
      // First create a user to test with
      const testUser = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
      await testUser.save()

      const response = await request(app).get(`/api/users/${testUser._id}`)
      expect(response.status).toBe(200)
      expect(response.body.username).toBe("testuser")
      expect(response.body.email).toBe("test@example.com")

      // Clean up
      await User.findByIdAndDelete(testUser._id)
    })

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const response = await request(app).get(`/api/users/${nonExistentId}`)
      expect(response.status).toBe(404)
    })
  })
})

