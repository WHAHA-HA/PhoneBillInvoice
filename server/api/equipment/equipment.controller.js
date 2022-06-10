/**
 * Created by bear on 2/23/16.
 */
var Equipment = require('./equipment.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};


  Equipment.findAllWithPaging(query, {with: ['vendor', 'site', 'site.building', 'contract', 'siteType', 'equipment_interfaces']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {

  var id = req.params.id;


  Equipment.find(id, {with: ['vendor', 'site', 'site.building', 'contract', 'siteType', 'equipment_interfaces']})
    .then(function (equipment) {
      res.send(equipment);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  Equipment.create(input, {with: ['vendor', 'site', 'site.building', 'contract', 'siteType', 'equipment_interfaces']})
    .then(function (equipment) {
      res.send(equipment);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;


  Equipment.find(id)
    .then(function (equipment) {
      equipment = extend(equipment, input);

      return Equipment.update(id, equipment, {with: ['vendor', 'site', 'site.building', 'contract', 'siteType']});
    })
    .then(function (equipment) {
      res.send(equipment);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Equipment.find(id)
    .then(function(equipment) {

      Equipment.destroy(id, {equipment: equipment})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);

    });

};
