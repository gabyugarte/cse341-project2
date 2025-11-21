// routes/movies.js
const router = require('express').Router();
const moviesController = require('../controllers/movies');
const validation = require('../middleware/validation');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', moviesController.getAllMovies);
router.get('/:id', moviesController.getMovieById);
// router.post('/', validation.saveMovie, moviesController.createMovie);
// router.put('/:id', validation.saveMovie, moviesController.updateMovie);
// router.delete('/:id', moviesController.deleteMovie);
router.post('/', isAuthenticated, validation.saveMovie, moviesController.createMovie);
router.put('/:id', isAuthenticated, validation.saveMovie, moviesController.updateMovie);
router.delete('/:id', isAuthenticated, moviesController.deleteMovie);

module.exports = router;
