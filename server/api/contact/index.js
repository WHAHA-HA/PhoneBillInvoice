/**
 * Created by bear on 2/20/16.
 */
'use strict';

var express = require('express');
var controller = require('./contact.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('contacts', 'Create'), controller.create);
router.put('/:id', security('contacts', 'Modify'), controller.update);
router.delete('/:id', security('contacts', 'Delete'), controller.delete);


module.exports = router;
