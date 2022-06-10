'use strict';

var express = require('express');
var controller = require('./inventory_gl_string.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.post('/save', controller.save);

module.exports = router;
