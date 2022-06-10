'use strict';

var express = require('express');
var controller = require('./user.controller');
var security = require('../../components/security');
var router = express.Router();

router.get('/',  controller.index);
router.get('/me', controller.me);
router.get('/:id', controller.show);
router.post('/', security('users', 'Create'), controller.create);
router.put('/:id/applyTheme', controller.applyTheme);
router.put('/:id/profile', controller.updateProfile);
router.put('/:id', security('users', 'Modify'), controller.update);
router.put('/:id/password', controller.updatePassword);

module.exports = router;
