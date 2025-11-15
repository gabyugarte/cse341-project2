const router = require('express').Router();
const directorsController = require('../controllers/directors');
const validation = require('../middleware/directorsValidation');

router.get('/', directorsController.getAllDirectors);
router.get('/:id', directorsController.getDirectorById);
router.post('/', validation.saveDirector, directorsController.createDirector);
router.put('/:id', validation.saveDirector, directorsController.updateDirector);
router.delete('/:id', directorsController.deleteDirector);

module.exports = router;
