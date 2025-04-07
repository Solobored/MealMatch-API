import User from "../models/user.js"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import dotenv from "dotenv"

// Ensure environment variables are loaded
dotenv.config()

// Configure JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

// Configure Google OAuth strategy
const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
}

// Initialize passport strategies
export const initializePassport = () => {
  // Debug: Check if JWT_SECRET is available
  if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET environment variable is not set!")
    // Provide a fallback for development only
    process.env.JWT_SECRET = "fallback_secret_for_development_only"
  }

  // JWT Strategy
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await User.findById(payload.id)
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        return done(error, false)
      }
    }),
  )

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value })

        if (!user) {
          // Create new user if doesn't exist
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            // No password needed for OAuth users
            password: "oauth-user-" + Math.random().toString(36).substring(2),
          })
          await user.save()
        } else if (!user.googleId) {
          // Link Google account to existing user
          user.googleId = profile.id
          await user.save()
        }

        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    }),
  )

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}

// Middleware to authenticate JWT
export const authenticateJWT = passport.authenticate("jwt", { session: false })

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() || req.user) {
    return next()
  }
  res.status(401).json({ message: "Unauthorized: Please log in" })
}

