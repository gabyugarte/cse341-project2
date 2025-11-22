
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;

const mongodb = require("./data/database");

// Routes
const moviesRoutes = require("./routes/movies");
const directorsRoutes = require("./routes/directors");
const authRoutes = require("./routes/auth");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

/* -------------------------------------
   1. CORS 
-------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);

/* -------------------------------------
   2. Body parser y cookies
-------------------------------------- */
app.use(bodyParser.json());
app.use(cookieParser());

/* -------------------------------------
   3. Session config
-------------------------------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* -------------------------------------
   4. Passport GitHub
-------------------------------------- */
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

/* -------------------------------------
   5. Rutas 
-------------------------------------- */
app.use("/", authRoutes);

app.use("/movies", moviesRoutes);
app.use("/directors", directorsRoutes);

/* -------------------------------------
   6. Swagger
-------------------------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* -------------------------------------
   7. Página inicial
-------------------------------------- */
app.get("/", (req, res) => {
  res.send(
    req.session.user
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged Out"
  );
});

/* -------------------------------------
   8. Start server
-------------------------------------- */
mongodb.initDb((err) => {
  if (err) console.error("DB Error:", err);
  else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});
