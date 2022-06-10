'use strict';

var express = require('express');
var controller = require('./history.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/contracts', controller.contracts);
router.get('/inventories', controller.inventories);

module.exports = router;
