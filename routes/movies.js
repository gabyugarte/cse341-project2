// routes/movies.js
const router = require('express').Router();
const moviesController = require('../controllers/movies');
const validation = require('../middleware/validation');

router.get('/', moviesController.getAllMovies);

router.get('/:id', moviesController.getMovieById);

router.post('/', validation.saveMovie, moviesController.createMovie);

router.put('/:id', validation.saveMovie, moviesController.updateMovie);

router.delete('/:id', moviesController.deleteMovie);

module.exports = router;
