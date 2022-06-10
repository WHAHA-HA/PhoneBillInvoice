'use strict';

var express = require('express');
var controller = require('./report.controller');
var security = require('../../components/security');
var router = express.Router();


router.get('/:id', security('reports', 'View'), controller.show);

module.exports = router;
