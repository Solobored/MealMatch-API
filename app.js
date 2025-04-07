import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import passport from "passport"
import session from "express-session"

// Import routes
import routes from "./routes/index.js"

// Import swagger docs and passport config
import swaggerDocs from "./config/swagger.js"
import { initializePassport } from "./middleware/auth.js"

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())
initializePassport()

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use("/api", routes)

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to MealMatch API. Visit /api-docs for documentation.")
})

export default app

