'use strict';

var express = require('express');
var controller = require('./audit.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('audit', 'View'),controller.index);
router.get('/:id', security('audit', 'View'), controller.show);
router.post('/', security('audit', 'Create'), controller.create);
router.put('/:id', security('audit', 'Modify'), controller.update);
router.delete('/:id', security('audit', 'Delete'), controller.delete);

module.exports = router;
