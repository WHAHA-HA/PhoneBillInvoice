'use strict';

var express = require('express');
var controller = require('./order.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('orders', 'View'), controller.index);
router.get('/:id', security('orders', 'View'), controller.show);
router.post('/', security('orders', 'Create'), controller.create);
router.put('/:id', security('orders', 'Modify'), controller.update);
router.delete('/:id', security('orders', 'Delete'), controller.delete);


module.exports = router;
