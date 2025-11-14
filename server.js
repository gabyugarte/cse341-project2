// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mongodb = require('./data/database');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Routes
const moviesRoutes = require('./routes/movies');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Movies API routes
app.use('/movies', moviesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Movies API is running...');
});

// Connect to DB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error(' Failed to connect to database:', err);
  } else {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});
