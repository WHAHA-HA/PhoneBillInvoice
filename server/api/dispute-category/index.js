'use strict';

var express = require('express');
var controller = require('./dispute-category.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('disputecategory', 'Create'), controller.create);

module.exports = router;
