'use strict';

var express = require('express');
var controller = require('./building.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('buildings', 'Create'), controller.create);
router.put('/:id', security('buildings', 'Modify'), controller.update);
router.delete('/:id', security('buildings', 'Delete'), controller.delete);


module.exports = router;
