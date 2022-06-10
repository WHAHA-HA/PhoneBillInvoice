'use strict';

var Inventory = require('./inventory.model');
var InventorySite = require('./inventory-site.model');
var InventoryFeature = require('./inventory-feature.model');
var InventoryPlan = require('./inventory-plan.model');
var UnderlyingService = require('./inventory-underlying-service.model');
var Route = require('./inventory-route.model');
var Site = require('../site/site.model');

var InventoryDocument = require('./inventory-document.model');
var InventoryDocumentEntity = require('./inventory-document-entity.model');
var aws = require('../../components/aws')();

var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

    var query = req.query.filter ? JSON.parse(req.query.filter) : {};

    Inventory.findAllWithPaging(query, {with : ['vendor', 'contract', 'type', 'site', 'topology', 'technology', 'features', 'plans', 'services']})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.show = function (req, res, next) {

    var id = req.params.id;

    Inventory.find(id, {with : ['vendor', 'contract', 'type', 'topology', 'technology', 'features', 'plans', 'services', 'routes', 'order_service',
            'inventory_sites', 'inventory_sites.site', 'inventory_sites.site.vendor', 'inventory_sites.site.building', 'inventory_sites.site.type']})
            .then(function (inventory) {
                res.send(inventory);
            })
            .catch(next);

};


exports.create = function (req, res, next) {
    var input = req.body;

    if (input.sp_ckt_id) {
        input.unique_id = input.sp_ckt_id;
    }
    isUniqueIdValid(input.unique_id, input.vendor_id, 0).then(function (data) {
        if (data.length === 0 || !input.unique_id) {

            // TODO: Add validation

            Inventory.create(input, {with : ['vendor', 'contract', 'type', 'topology', 'technology', 'site', 'features', 'plans', 'services', 'routes', 'inventory_sites', 'inventory_sites.site', 'inventory_sites.site.vendor', 'inventory_sites.site.building', 'inventory_sites.site.type']})
                    .then(function (inventory) {
                        res.send(inventory);
                    })
                    .catch(next);
        } else {
            res.status(400).end("Duplicate unique id");
        }
    });
};

exports.update = function (req, res, next) {
    var input = req.body,
            id = req.params.id;

    if (input.sp_ckt_id) {
        input.unique_id = input.sp_ckt_id;
    }
    isUniqueIdValid(input.unique_id, input.vendor_id, id).then(function (data) {
        if (data.length === 0 || !input.unique_id) {
            // TODO: Add validation

            Inventory.find(id)
                    .then(function (inventory) {
                        inventory = extend(inventory, input);

                        /**
                         * Extend doesn't work well with date
                         */
                        inventory.install_date = input.install_date;
                        inventory.exp_date = input.exp_date;
                        inventory.disc_date = input.disc_date;
                        inventory.term_date = input.term_date;
                        inventory.acq_date = input.acq_date;
                        inventory.upgrade_date = input.upgrade_date;

                        return Inventory.update(id, inventory, {with : ['site', 'topology', 'technology', 'vendor', 'contract', 'services', 'inventory_sites', 'inventory_sites.site']});
                    })
                    .then(function (inventory) {
                        res.send(inventory);
                    })
                    .catch(next);
        } else {
            res.status(400).end("Duplicate unique id");
        }
    });

};

exports.delete = function (req, res, next) {

    var id = req.params.id;

    Inventory.destroy(id)
            .then(function () {
                res.sendStatus(200);
            })
            .catch(next);

};

//Get Action: Sites
exports.sites = function (req, res) {
    var id = req.params.id;

    InventorySite.findAll({where: {inventory_id: {'===': id}}}, {with : ['site']})
            .then(function (sites) {
                console.log('Found sites for inventory: ', sites);
                res.send(sites.map(function (doc) {
                    return doc.site;
                }));
            }, function (err) {
                console.log('Error getting sites for inventory: ', err);
                res.status(400).send(err);
            });
};

// add entry to inventory_site table
exports.addSite = function (req, res, next) {
    var site = req.body,
            inventory_id = req.params.id,
            site_id = req.params.siteId;

    var ele = {inventory_id: inventory_id, site_id: site_id};

    site.inventory_id = inventory_id;


    InventorySite.create(ele, {site: site})
            .then(function (inventorySite) {
                res.send(inventorySite);
            })
            .catch(next);
};

//delete entry from inventory_site table
exports.deleteSite = function (req, res, next) {

    var site = req.body,
            inventory_id = req.params.id,
            site_id = req.params.siteId;

    Site.find(site_id)
            .then(function (site) {
                InventorySite.destroyAll({
                    where: {
                        inventory_id: {
                            '==': inventory_id
                        },
                        site_id: {
                            '==': site_id
                        }
                    }
                }, {site: site, inventory_id: inventory_id})
                        .then(function () {
                            res.sendStatus(200);
                        })
                        .catch(next);
            });



};


// add entry to inventory_feature table
exports.addFeature = function (req, res, next) {
    var feature = req.body,
            inventory_id = req.params.id;

    feature.inventory_id = inventory_id;

    InventoryFeature.create(feature)
            .then(function (feature) {
                res.send(feature);
            })
            .catch(next);
};

// update inventory_feature table
exports.updateFeature = function (req, res, next) {
    var input = req.body,
            inventory_id = req.params.id,
            id = req.params.featureId;

    //feature.inventory_id = inventory_id;

    InventoryFeature.find(id)
            .then(function (feature) {
                feature = extend(feature, input);
                return InventoryFeature.update(id, feature);
            })
            .then(function (feature) {
                res.send(feature);
            })
            .catch(next);

};


//remove record from inventory_feature table
exports.removeFeature = function (req, res, next) {
    var input = req.body,
            id = req.params.featureId;

    InventoryFeature.find(id)
            .then(function (feature) {
                InventoryFeature.destroy(id, {inventory_id: req.params.id, feature: feature})
                        .then(function () {
                            res.status(200).end();
                        })
                        .catch(next);
            });

};

// add entry to inventory_plan table
exports.addPlan = function (req, res, next) {
    var plan = req.body,
            inventory_id = req.params.id;

    plan.inventory_id = inventory_id;

    InventoryPlan.create(plan)
            .then(function (plan) {
                res.send(plan);
            })
            .catch(next);
};

// update inventory_plan table
exports.updatePlan = function (req, res, next) {
    var input = req.body,
            inventory_id = req.params.id,
            id = req.params.planId;

    InventoryPlan.find(id)
            .then(function (plan) {
                plan = extend(plan, input);
                return InventoryPlan.update(id, plan);
            })
            .then(function (plan) {
                res.send(plan);
            })
            .catch(next);

};


//remove record from inventory_plan table
exports.removePlan = function (req, res, next) {
    var input = req.body,
            id = req.params.planId;

    InventoryPlan.find(id)
            .then(function (plan) {
                InventoryPlan.destroy(id, {inventory_id: req.params.id, plan: plan})
                        .then(function () {
                            res.status(200).end();
                        })
                        .catch(next);
            });

};

// add underlying service to underlying_service table
exports.addService = function (req, res, next) {
    var service = req.body,
            inventory_id = req.params.id;

    service.inventory_id = inventory_id;

    UnderlyingService.create(service)
            .then(function (service) {
                res.send(service);
            })
            .catch(next);
};

//remove record from underlying_service table
exports.removeService = function (req, res, next) {
    var input = req.body,
            id = req.params.serviceId;

    UnderlyingService.find(id)
            .then(function (service) {
                UnderlyingService.destroy(id, {inventory_id: req.params.id, service: service})
                        .then(function () {
                            res.status(200).end();
                        })
                        .catch(next);
            });

};


// add route to route table
exports.addRoute = function (req, res, next) {
    var route = req.body,
            inventory_id = req.params.id;

    route.inventory_id = inventory_id;

    Route.create(route)
            .then(function (route) {
                res.send(route);
            })
            .catch(next);
};

// update route table
exports.updateRoute = function (req, res, next) {
    var input = req.body,
            inventory_id = req.params.id,
            id = req.params.routeId;

    Route.find(id)
            .then(function (route) {
                route = extend(route, input);
                return Route.update(id, route);
            })
            .then(function (route) {
                res.send(route);
            })
            .catch(next);

};

//remove route from route table
exports.removeRoute = function (req, res, next) {
    var input = req.body,
            id = req.params.routeId;

    Route.find(id)
            .then(function (route) {
                Route.destroy(id, {inventory_id: req.params.id, route: route})
                        .then(function () {
                            res.status(200).end();
                        })
                        .catch(next);
            });

};



exports.createDoc = function (req, res, next) {

    console.log('Found files: ', req.files);

    if (!req.files || !req.files.files) {
        res.end();
        return;
    }

    var files = req.files.files,
        entity = req.body.entity,
        file = files[0],
        folder = req.body.folder,
        filename = file.originalFilename;

    var settings = {
        file: file,
        folder: folder,
        key: filename
    };

    aws.uploadFile(settings, function (err, response) {
        if (err) {
            next(err);
            return;
        }

        var param = {entity_id: null, with: ['contract_type']};

        if (entity) {
            param.entity_id = entity.id;
            param.parent_type = entity.parent_type;
        }

        console.log('description:', req.body.description);
        console.log('contract type id:', req.body.contract_type_id);
        console.log('effective date:', req.body.effective_date);
        console.log('term:', req.body.term);
        console.log('exp_date:', req.body.exp_date);
        console.log('mrc:', req.body.mrc);
        console.log('nrc:', req.body.nrc);

        return InventoryDocument.create({
            path: filename,
            type: file.type,
            description: req.body.description,
            contract_type_id: req.body.contract_type_id,
            effective_date: req.body.effective_date,
            term: req.body.term,
            exp_date: req.body.exp_date,
            mrc: req.body.mrc,
            nrc: req.body.nrc
        }, param)
            .then(function (document) {

                if (entity && entity.id) {
                    return InventoryDocumentEntity.create({
                        inventory_document_id: document.id,
                        inventory_id: entity.id
                    })
                        .then(function () {
                            return document;
                        });
                }
                else {
                    return document;
                }

            })
            .then(function (document) {
                res.send(document);
            })
            .catch(next);
    });
};


exports.updateDoc = function (req, res, next) {

    if (!req.files || !req.files.files) {
        res.status(404).end();
        return;
    }

    var files = req.files.files,
        entity = req.body.entity,
        document = req.body.document,
        file = files[0],
        folder = req.body.folder,
        filename = file.originalFilename;

    var settings = {
        file: file,
        folder: folder,
        key: filename
    };

    aws.uploadFile(settings, function (err, response) {
        if (err) {
            next(err);
            return;
        }


        return InventoryDocument.update(document.id, {
            path: filename,
            type: file.type,
            description: req.body.description,
            contract_type_id: req.body.contract_type_id,
            effective_date: req.body.effective_date,
            term: req.body.term,
            exp_date: req.body.exp_date,
            mrc: req.body.mrc,
            nrc: req.body.nrc
        }, {entity_id: entity.id, parent_type: entity.parent_type})
            .then(function (document) {
                res.send(document);
            })
            .catch(next);
    });
};


exports.deleteDoc = function (req, res, next) {
    var id = req.params.did,
        eid = req.params.id,
        parent_type = 'inventory'; //entity id

    InventoryDocumentEntity.destroyAll({where: {inventory_document_id: {'===': id}}})
        .then(function () {
            InventoryDocument.find(id)
                .then(function(document) {
                    return InventoryDocument.destroy(id, {entity_id: eid, parent_type: parent_type, document: document});
                })
        })
        .then(function () {
            res.end();
        })
        .catch(next);
};


exports.downloadDoc = function (req, res) {
    var id = req.params.did;
    var folder = 'inventories';
    console.log('Starting to download file with id', id);

    InventoryDocument.find(id)
        .then(function (document) {

            var settings = {
                folder: folder,
                key: document.path
            };
            console.log('Document found so start to download', id);

            var buck = aws.downloadFile(settings);
            var path = document.path.replace(new RegExp(' ', 'g'), '+', 'gi');
            var file = require('fs').createWriteStream('.tmp/' + path);
            var rs = buck.createReadStream();
            rs.on('error', function (err) {
                res.status(404).end();
            });
            rs.pipe(file);

            file.on('close', function(c){
                res.setHeader("content-type", document.type);
                res.attachment(document.path);
                res.download('.tmp/' + path, path);
            });
        });
};

exports.documents = function (req, res) {
    var id = req.params.id;

    InventoryDocumentEntity.findAll({where: {inventory_id: {'===': id}}}, {with: ['inventory_document', 'inventory_document.contract_type']})
        .then(function (documents) {
            res.send(documents.map(function (doc) {
                return doc.inventory_document;
            }));
        }, function (err) {
            console.log('Error getting documents for inventory: ', err);
            res.status(400).send(err);
        });
};


function isUniqueIdValid(uniqueId, vendorId, invId) {
    return Inventory.findAll({
        where: {
            unique_id: {"==": uniqueId},
            vendor_id: {"==": vendorId},
            id: {"!=": invId}
        }

    }, {bypassCache: true});
}

