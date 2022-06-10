'use strict';

var express = require('express');
var controller = require('./recon.controller');
var security = require('../../components/security');
var router = express.Router();

// unlinked inventories, it will return items on the invoice but not on inventory
router.get('/invoices/', security('recon', 'View'), controller.invoices);

//Accruals, it will return items on the inventory but not on invoice
router.get('/inventories/', security('recon', 'View'), controller.inventories);

module.exports = router;
