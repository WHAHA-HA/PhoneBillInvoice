'use strict';

var express = require('express');
var controller = require('./note.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);

module.exports = router;
