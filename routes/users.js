var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/api/users.controller.js');

router.post('/contact', userCtrl.contact);
router.post('/carrers', userCtrl.carrers);

module.exports = router;
