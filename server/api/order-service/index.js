'use strict';

var express = require('express');
var controller = require('./order-service.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('orderservice', 'View'), controller.index);
router.get('/:id', security('orderservice', 'View'), controller.show);
router.post('/', security('orderservice', 'Create'), controller.create);
router.put('/:id', security('orderservice', 'Modify'), controller.update);
router.delete('/:id', security('orderservice', 'Delete'), controller.delete);

module.exports = router;
