'use strict';

var express = require('express');
var controller = require('./invoice.controller');
var router = express.Router();
var secure = require('../../components/security');

router.get('/', secure('invoices', 'View') , controller.index);
router.get('/facepage', controller.findFacepage);
router.get('/:id', secure('invoices', 'View') ,controller.show);
router.put('/:id', secure('invoices', 'Update') ,controller.update);
router.get('/invoices/:id/charges', secure('invoices', 'View Charges') , controller.charges);


module.exports = router;
