import swaggerJsDoc from "swagger-jsdoc"

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MealMatch API",
      version: "1.0.0",
      description: "API for MealMatch recipe application",
      contact: {
        name: "API Support",
        email: "support@mealmatch.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://your-production-url.com"
            : `http://localhost:${process.env.PORT || 3000}`,
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
  apis: ["./routes/*.js", "./swagger/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export default swaggerDocs

