/**
 * Created by bear on 2/23/16.
 */
'use strict';

var express = require('express');
var controller = require('./equipment_interface.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('equipment_interface', 'Create'), controller.create);
router.put('/:id', security('equipment_interface', 'Modify'), controller.update);
router.delete('/:id', security('equipment_interface', 'Delete'), controller.delete);


module.exports = router;
