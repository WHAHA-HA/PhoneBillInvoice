'use strict';
var InventoryGlString = require('./inventory-gl-string.model');
var Promise = require('es6-promise').Promise;

exports.index = function (req, res, next) {

    var query = req.query.filter ? JSON.parse(req.query.filter) : {};

    InventoryGlString.findAll(query, {with : ['inventory', 'glString', 'glString.glCodesNonVer']})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.save = function (req, res, next) {
    var input = req.body.values;
    var id = req.body.inv;
    InventoryGlString.findAll({
        where: {
            inv_id: {'===': id}
        }
    }).then(function (oldValues) {
        var promises = [];
        for (var i in input) {
            if (input[i].id) {
                promises.push(InventoryGlString.update(input[i].id, input[i]));
            } else if (!input[i].id) {
                promises.push(InventoryGlString.create(input[i]));
            }            
        }
        for (var j in oldValues) {        
            var t = true;
            for (var i in input) {
                if (oldValues[j].id === input[i].id) {
                    t = false;
                }
            }
            if (t) {
                promises.push(InventoryGlString.destroy(oldValues[j].id));
            }
        }

        return Promise.all(promises).then(function () {
            InventoryGlString.findAll({
                where: {
                    inv_id: {'===': id}
                }
            }).then(function (data) {
                res.send(data);
            }).catch(next);
        }).catch(next);
    });
};