'use strict';

var express = require('express');
var controller = require('./permission.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('permissions', 'View'), controller.index);
router.get('/me', controller.me);
router.get('/:id', security('permissions', 'View'), controller.show);
router.post('/', security('permissions', 'Create'), controller.create);
router.put('/:id', security('permissions', 'Modify'), controller.update);
router.delete('/:id', security('permissions', 'Delete'), controller.delete);

module.exports = router;
