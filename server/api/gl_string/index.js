'use strict';

var express = require('express');
var controller = require('./glstring.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/status', controller.updateStatus);

module.exports = router;
