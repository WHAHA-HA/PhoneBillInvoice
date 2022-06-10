'use strict';

var express = require('express');
var controller = require('./vendor.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', security('vendors', 'Create'), controller.create);
router.put('/:id/assignAlias', security('vendors', 'Create'), controller.assignAlias);
router.post('/:id/addAlias', security('vendors', 'Create'), controller.addAlias);
router.delete('/:id/removeAlias', security('vendors', 'Create'), controller.removeAlias);
router.put('/:id', security('vendors', 'Modify'), controller.update);
router.delete('/:id', security('vendors', 'Delete'), controller.delete);

module.exports = router;
