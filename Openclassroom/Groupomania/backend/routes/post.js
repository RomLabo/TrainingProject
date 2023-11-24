const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.get('/', auth, postController.getAllPosts);

router.get('/:id', auth, postController.getOnePost);

router.get('/comments/:id', auth, postController.getAllComments);

router.get('/like/:id', auth, postController.getOneLiker);


router.post('/', auth, multer, postController.createPost);

router.post('/comments/:id', auth, postController.createComment);

router.post('/:id/like', auth, postController.createStateLike);


router.put('/:id', auth, multer, postController.modifyPost);


router.delete('/:id', auth, postController.deleteOnePost);

router.delete('/comments/:id', auth, postController.deleteOneComment);

module.exports = router;