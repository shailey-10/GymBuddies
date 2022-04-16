const express = require('express');
const fileUpload = require('../middlewares/file-upload')

const router = express.Router();

const adminController = require('../controllers/admin-controllers')

router.post('/signup', fileUpload.single('image'), adminController.signUp);

router.post('/checkin', adminController.checkin);

router.delete('/checkout', adminController.checkout);

router.get('/users-in-gym', adminController.usersInGym);

module.exports = router;