'use strict';

var express = require('express');
var controller = require('./dictionary.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/groups/', controller.groups);
router.get('/:group', controller.index);
router.get('/', controller.all);
router.get('/:id', controller.show);
router.post('/', security('dictionary', 'Create'), controller.create);
router.put('/:id', security('dictionary', 'Modify'), controller.update);

module.exports = router;
