'use strict';

var express = require('express');
var controller = require('./account.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('accounts', 'View'), controller.index);
router.get('/:id',security('accounts', 'View'), controller.show);
router.post('/', security('accounts', 'Create'),controller.create);
router.put('/:id', security('accounts', 'Modify'),controller.update);
router.delete('/:id', security('accounts', 'Delete'), controller.delete);
router.put('/:id/updateStatus', security('accounts', 'Modify'),controller.updateStatus);

module.exports = router;
