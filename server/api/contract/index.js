'use strict';

var express = require('express');
var controller = require('./contract.controller');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var security = require('../../components/security');
var router = express.Router();

router.get('/', security('contracts', 'View'), controller.index);
router.get('/:id', security('contracts', 'View'), controller.show);
router.post('/', security('contracts', 'Create'), controller.create);
router.put('/:id', security('contracts', 'Modify'), controller.update);
router.delete('/:id', security('contracts', 'Delete'), controller.delete);
router.get('/:id/section', security('contracts', 'View Section'), controller.getSections);
router.post('/:id/section', security('contracts', 'Create Section'), controller.createSection);
router.put('/:id/section/:sid', security('contracts', 'Modify Section'), controller.updateSection);
router.delete('/:id/section/:sid', security('contracts', 'Delete Section'), controller.deleteSection);
router.post('/:id/document', security('contracts', 'Create Document'), multipartMiddleware, controller.setDocument);
//router.get('/:id/document', multipartMiddleware, controller.readDocument);
router.post('/:id/deleteDocument', security('contracts', 'Delete'), controller.deleteDocument);

module.exports = router;
