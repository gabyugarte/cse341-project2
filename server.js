
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const mongodb = require('./data/database');

// // Swagger
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// // Routes
// const moviesRoutes = require('./routes/movies');
// const directorsRoutes = require('./routes/directors');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Swagger route
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Movies API routes
// app.use('/movies', moviesRoutes);

// // Directors API routes
// app.use('/directors', directorsRoutes);

// // Root endpoint
// app.get('/', (req, res) => {
//   res.send('Movies API is running...');
// });

// // Connect to DB and start server
// mongodb.initDb((err) => {
//   if (err) {
//     console.error(' Failed to connect to database:', err);
//   } else {
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   }
// });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;

const mongodb = require('./data/database');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Routes
const moviesRoutes = require('./routes/movies');
const directorsRoutes = require('./routes/directors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile); 
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/movies', moviesRoutes);
app.use('/directors', directorsRoutes);
app.use('/auth', authRoutes);

// Root
app.get('/', (req, res) => {
  if (req.session.user) {
    res.send("Logged In as " + req.session.user.username);
  } else {
    res.send("Logged Out");
  }
});

// Connect to DB & start server
mongodb.initDb((err) => {
  if (err) {
    console.error(' Failed to connect to database:', err);
  } else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});
