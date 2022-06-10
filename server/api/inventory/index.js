'use strict';

var express = require('express');
var controller = require('./inventory.controller');
var security = require('../../components/security');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/', security('inventory', 'View'), controller.index);
router.get('/:id', security('inventory', 'View'), controller.show);
router.post('/', security('inventory', 'Create'), controller.create);
router.put('/:id', security('inventory', 'Modify'), controller.update);
router.delete('/:id', security('inventory', 'Delete'), controller.delete);

router.get('/:id/sites', security('inventory', 'View Site'), controller.sites);
router.put('/:id/site/:siteId', security('inventory', 'Create Site'), controller.addSite);
router.delete('/:id/site/:siteId', security('inventory', 'Delete Site'), controller.deleteSite);

router.post('/:id/feature', security('inventory', 'Create Feature'), controller.addFeature);
router.delete('/:id/feature/:featureId', security('inventory', 'Delete Feature'), controller.removeFeature);
router.put('/:id/feature/:featureId', security('inventory', 'Create Feature'), controller.updateFeature);

router.post('/:id/plan', security('inventory', 'Create Plan'), controller.addPlan);
router.delete('/:id/plan/:planId', security('inventory', 'Delete Plan'), controller.removePlan);
router.put('/:id/plan/:planId', security('inventory', 'Create Plan'), controller.updatePlan);

router.post('/:id/service', security('inventory', 'Create Service'), controller.addService);
router.delete('/:id/service/:serviceId', security('inventory', 'Delete Service'), controller.removeService);

router.post('/:id/route', security('inventory', 'Create Route'), controller.addRoute);
router.delete('/:id/route/:routeId', security('inventory', 'Delete Route'), controller.removeRoute);
router.put('/:id/route/:routeId', security('inventory', 'Create Route'), controller.updateRoute);

/**
 * Inventory Document Section
 */
router.get('/:id/document/:did/download', controller.downloadDoc);
router.post('/:id/document', security('document', 'Create'), multipartMiddleware, controller.createDoc);
router.put('/:id/document/:did', security('document', 'Modify'), multipartMiddleware, controller.updateDoc);
router.delete('/:id/document/:did', security('document', 'Delete'), controller.deleteDoc);
router.get('/:id/documents', security('document', 'Entity'), controller.documents);

module.exports = router;
