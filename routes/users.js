var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/api/users.controller.js');


router.post('/signup', userCtrl.signup);
router.post('/social_signup', userCtrl.socialSignup);
router.post('/login', userCtrl.login);
router.post('/check_user_exists', userCtrl.checkUserExists);
router.post('/contact', userCtrl.contact);
router.post('/carrers', userCtrl.carrers);

module.exports = router;
