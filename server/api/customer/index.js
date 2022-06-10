/**
 * Created by bear on 2/20/16.
 */
'use strict';

var express = require('express');
var controller = require('./customer.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('customers', 'Create'), controller.create);
router.put('/:id', security('customers', 'Modify'), controller.update);
router.delete('/:id', security('customers', 'Delete'), controller.delete);


module.exports = router;
