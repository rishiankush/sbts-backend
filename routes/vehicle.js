const express = require('express');
const router = express.Router();
const vclCtrl = require('../controllers/api/vehicle.controller.js');

router.post('/create', vclCtrl.create);

module.exports = router;