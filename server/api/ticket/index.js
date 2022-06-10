'use strict';

var express = require('express');
var controller = require('./ticket.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('tickets', 'View'), controller.index);
router.get('/:id', security('tickets', 'View'), controller.show);
router.post('/', security('tickets', 'View'), controller.create);
router.put('/:id', security('tickets', 'View'), controller.update);
router.delete('/:id', security('tickets', 'View'), controller.delete);


module.exports = router;
