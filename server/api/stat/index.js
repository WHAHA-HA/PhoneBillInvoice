'use strict';

var express = require('express');
var controller = require('./stat.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);

module.exports = router;
