const express = require('express');
const {check } = require('express-validator')

const postControllers = require('../controllers/posts-controllers');
const checkAuth = require('../middlewares/check-auth');
const fileUpload = require('../middlewares/file-upload')

const router = express.Router();



router.get('/feed', postControllers.getFeed);
router.get('/:pid', postControllers.getPostById);
router.get('/user/:uid', postControllers.getPostsByUserId);
router.use(checkAuth);
router.post('/', fileUpload.single('image'),[
    check('title').not().isEmpty(),
    check('description').isLength({min: 5})]
    , postControllers.createPost);
router.patch('/:pid', fileUpload.single('image'), [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5})],  postControllers.updatePost);
router.delete('/:pid', postControllers.deletePost);

module.exports = router;