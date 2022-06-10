'use strict';

var express = require('express');
var controller = require('./content-filter.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('contentfilter', 'View'), controller.index);
router.get('/:id', security('contentfilter', 'View'), controller.show);
router.post('/', security('contentfilter', 'Create'), controller.create);
router.put('/:id', security('contentfilter', 'Modify'), controller.update);
router.delete('/:id', security('contentfilter', 'Delete'), controller.delete);


module.exports = router;
