'use strict';

var express = require('express');
var controller = require('./document.controller');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var security = require('../../components/security');
var router = express.Router();

router.get('/:id', security('document', 'View'), multipartMiddleware, controller.index);
router.get('/:id/download/:folder', controller.download);
router.get('/:id/download/:folder/:subfolder', controller.download);
router.get('/:id/entity', security('document', 'Entity'), controller.entity);
router.post('/', security('document', 'Create'), multipartMiddleware, controller.create);
router.put('/:id', security('document', 'Modify'), multipartMiddleware, controller.update);
router.delete('/:id', security('document', 'Delete'), controller.delete);

module.exports = router;