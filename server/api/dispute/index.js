'use strict';

var express = require('express');
var controller = require('./dispute.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('disputes', 'View'), controller.index);
router.get('/charges_disputed', controller.isChargesDisputed);
router.get('/:id', security('disputes', 'View'), controller.show);
router.post('/', security('disputes', 'Create'), controller.create);
router.put('/:id', security('disputes', 'Modify'), controller.update);
module.exports = router;
