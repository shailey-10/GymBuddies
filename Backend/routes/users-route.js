const express = require('express');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();



router.get('/', usersControllers.getUsers);

router.post('/login', usersControllers.login);

router.get('/userCheckin/:uid', usersControllers.userCheckin);



module.exports = router;