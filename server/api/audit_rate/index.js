/**
 * Created by bear on 2/26/16.
 */
'use strict';

var express = require('express');
var controller = require('./audit_rate.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('auditrate', 'View'), controller.index);
router.get('/:id', security('auditrate', 'View'), controller.show);
router.post('/', security('auditrate', 'Create'), controller.create);
router.put('/:id', security('auditrate', 'Modify'), controller.update);
router.delete('/:id', security('auditrate', 'Delete'), controller.delete);

module.exports = router;
