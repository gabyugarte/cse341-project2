const router = require('express').Router();
const passport = require('passport');

// LOGIN PAGE
router.get('/login', passport.authenticate('github'));

// CALLBACK AFTER LOGIN
router.get(
  '/login/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// LOGOUT
router.get('/logout', (req, res) => {
  req.logout(() => {});
  req.session.destroy();
  res.send("Logged Out");
});

module.exports = router;
