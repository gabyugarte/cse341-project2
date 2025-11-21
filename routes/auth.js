const router = require('express').Router();
const passport = require('passport');

// Step 1: start GitHub login process
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Step 2: GitHub redirects back to our app
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/failure'
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/auth/success');
  }
);

// Success route
router.get('/success', (req, res) => {
  res.json({
    message: "Logged in successfully!",
    user: req.session.user
  });
});

// Failure route
router.get('/failure', (req, res) => {
  res.status(401).json({ message: "Login failed" });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function(err){
    if (err) return next(err);
    req.session.destroy();
    res.send("Logged out");
  });
});

module.exports = router;
