'use strict';

var express = require('express');
var controller = require('./theme.controller');
var router = express.Router();

router.get('/', controller.index);
router.get('/master', controller.master);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;
