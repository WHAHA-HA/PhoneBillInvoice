'use strict';

var express = require('express');
var controller = require('./glcode.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id/invoiceSummary', controller.invoiceSummary);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/deleteAll', controller.delete);

module.exports = router;
