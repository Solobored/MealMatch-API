import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MealMatch API',
      version: '1.0.0',
      description: 'API for MealMatch application',
      contact: {
        name: 'API Support',
        email: 'support@mealmatch.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://mealmatch-api.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

// Write swagger.json file
const swaggerOutputPath = path.resolve(__dirname, '../swagger/swagger.json');

// Ensure directory exists
const swaggerDir = path.dirname(swaggerOutputPath);
if (!fs.existsSync(swaggerDir)) {
  fs.mkdirSync(swaggerDir, { recursive: true });
}

fs.writeFileSync(swaggerOutputPath, JSON.stringify(specs, null, 2));

console.log(`Swagger JSON file written to: ${swaggerOutputPath}`);

export default specs;