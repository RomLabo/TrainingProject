const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const auth = require('../middleware/auth');


router.get('/', auth, profileController.getAllProfile);

router.get('/:id', auth, profileController.getOneProfile);

router.delete('/', auth, profileController.deleteProfile);

router.delete('/:id', auth, profileController.deleteOneProfile);


module.exports = router;