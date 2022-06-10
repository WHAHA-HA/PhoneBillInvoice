'use strict';

var express = require('express');
var controller = require('./project.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('projects', 'View'), controller.index);
router.get('/:id', security('projects', 'View'), controller.show);
router.post('/', security('projects', 'Create'), controller.create);
router.put('/:id', security('projects', 'Modify'), controller.update);
router.delete('/:id', security('projects', 'Delete'), controller.delete);

router.get('/:id/orders', security('projects', 'View Order'), controller.orders);
router.post('/:id/order', security('projects', 'Create Order'), controller.createOrderInfo);
router.delete('/:id/order/:projectOrderId', security('projects', 'Delete Order'), controller.deleteOrder);


module.exports = router;
