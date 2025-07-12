const express = require('express');
const router = express.Router();
const {registerUser, loginuser, logoutUser} = require('../controllers/authControllers')



router.post('/register',registerUser);
router.post('/login',loginuser);
router.post('/logout',logoutUser);

module.exports = router;
