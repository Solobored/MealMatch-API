import request from "supertest"
import mongoose from "mongoose"
import { app, connectDB } from "../server.js"
import User from "../models/user.js"

describe("User API Routes", () => {
  beforeAll(async () => {
    // Connect to test database
    await connectDB()

    // Clean up any existing test users
    await User.deleteOne({ email: "test@example.com" })
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
    let testUser

    beforeEach(async () => {
      // Create a test user
      testUser = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
      await testUser.save()
    })

    afterEach(async () => {
      // Clean up
      if (testUser && testUser._id) {
        await User.findByIdAndDelete(testUser._id)
      }
    })

    it("should get a user by ID", async () => {
      const response = await request(app).get(`/api/users/${testUser._id}`)
      expect(response.status).toBe(200)
      expect(response.body.username).toBe("testuser")
      expect(response.body.email).toBe("test@example.com")
    })

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const response = await request(app).get(`/api/users/${nonExistentId}`)
      expect(response.status).toBe(404)
    })
  })
})
