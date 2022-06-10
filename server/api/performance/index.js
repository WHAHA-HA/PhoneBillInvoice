'use strict';

var express = require('express');
var controller = require('./performance.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
//router.get('/:id', controller.show);
//router.post('/', security('sites', 'Create'), controller.create);
//router.put('/:id', security('sites', 'Modify'), controller.update);
//router.delete('/:id', security('sites', 'Delete'), controller.delete);

module.exports = router;
