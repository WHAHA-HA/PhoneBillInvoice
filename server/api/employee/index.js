/**
 * Created by bear on 2/29/16.
 */
'use strict';

var express = require('express');
var controller = require('./employee.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('employee', 'Create'), controller.create);
router.put('/:id', security('employee', 'Modify'), controller.update);
router.delete('/:id', security('employee', 'Delete'), controller.delete);


module.exports = router;
