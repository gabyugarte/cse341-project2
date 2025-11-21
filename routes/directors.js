const router = require('express').Router();
const directorsController = require('../controllers/directors');
const validation = require('../middleware/directorsValidation');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', directorsController.getAllDirectors);
router.get('/:id', directorsController.getDirectorById);
// router.post('/', validation.saveDirector, directorsController.createDirector);
// router.put('/:id', validation.saveDirector, directorsController.updateDirector);
// router.delete('/:id', directorsController.deleteDirector);
router.post('/', isAuthenticated, validation.saveDirector, directorsController.createDirector);
router.put('/:id', isAuthenticated, validation.saveDirector, directorsController.updateDirector);
router.delete('/:id', isAuthenticated, directorsController.deleteDirector);


module.exports = router;
