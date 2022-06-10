'use strict';

var express = require('express');
var controller = require('./charge.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('charge', 'View'), controller.index);
router.get('/filters', security('charge', 'View'), controller.filters);

module.exports = router;
