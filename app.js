import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db.config.js';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json' assert { type: 'json' };

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/', routes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MealMatch API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

export default app;