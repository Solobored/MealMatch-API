import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import passport from "passport"
import session from "express-session"

import userRoutes from "./routes/userRoutes.js"
import recipeRoutes from "./routes/recipeRoutes.js"
import ingredientRoutes from "./routes/ingredientRoutes.js"
import favoriteRoutes from "./routes/favoriteRoutes.js"
import authRoutes from "./routes/authRoutes.js"

import { initializePassport } from "./middleware/auth.js"

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not set. Using a default value for development only.")
  process.env.JWT_SECRET = "default_jwt_secret_for_development_only"
}

if (!process.env.SESSION_SECRET) {
  console.warn("WARNING: SESSION_SECRET not set. Using JWT_SECRET as fallback.")
  process.env.SESSION_SECRET = process.env.JWT_SECRET
}

if (!process.env.FRONTEND_URL) {
  console.warn("WARNING: FRONTEND_URL not set. Using default localhost URL.")
  process.env.FRONTEND_URL = "http://localhost:5173"
}

// Debug: Check environment variables
console.log("Environment variables loaded:")
console.log("PORT:", process.env.PORT)
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set (value hidden)" : "Not set")
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set (value hidden)" : "Not set")
console.log("SESSION_SECRET:", process.env.SESSION_SECRET ? "Set (value hidden)" : "Not set")
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set (value hidden)" : "Not set")
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set (value hidden)" : "Not set")
console.log("FRONTEND_URL:", process.env.FRONTEND_URL)

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())
initializePassport()

// Connect to MongoDB
let dbConnection = null
const connectDB = async () => {
  if (!dbConnection) {
    dbConnection = await mongoose
      .connect(process.env.MONGODB_URI)
      .then((conn) => {
        console.log("Connected to MongoDB")
        return conn
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err)
        throw err
      })
  }
  return dbConnection
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MealMatch API",
      version: "1.0.0",
      description: "API for MealMatch recipe application",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" ? "https://your-production-url.com" : `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/recipes", recipeRoutes)
app.use("/api/ingredients", ingredientRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/auth", authRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to MealMatch API. Visit /api-docs for documentation.")
})

// Only start the server if this file is run directly (not imported in tests)
if (process.env.NODE_ENV !== "test" || process.env.START_SERVER === "true") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
}

export { app, connectDB }
export default app
