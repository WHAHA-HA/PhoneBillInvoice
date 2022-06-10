/**
 * Created by bear on 2/23/16.
 */
'use strict';

var express = require('express');
var controller = require('./equipment.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('equipment', 'Create'), controller.create);
router.put('/:id', security('equipment', 'Modify'), controller.update);
router.delete('/:id', security('equipment', 'Delete'), controller.delete);


module.exports = router;
