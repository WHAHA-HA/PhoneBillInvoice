'use strict';

var express = require('express');
var controller = require('./auth.controller');

var router = express.Router();

router.post('/login', controller.login);
router.post('/sendResetInstructions', controller.sendResetInstructions);
router.post('/resetPassword', controller.resetPassword);

module.exports = router;
