'use strict';

var express = require('express');
var controller = require('./role.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', security('roles', 'View'), controller.show);
router.post('/', security('roles', 'Create'), controller.create);
router.put('/:id', security('roles', 'Modify'), controller.update);
router.delete('/:id', security('roles', 'Delete'), controller.delete);


module.exports = router;
