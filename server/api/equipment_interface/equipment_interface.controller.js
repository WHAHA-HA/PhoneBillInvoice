/**
 * Created by bear on 7/7/16.
 */
var EquipmentInterface = require('./equipment_interface.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  EquipmentInterface.findAllWithPaging(query)
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {

  var id = req.params.id;

  EquipmentInterface.find(id)
    .then(function (equipment_interface) {
      res.send(equipment_interface);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  EquipmentInterface.create(input)
    .then(function (equipment_interface) {
      res.send(equipment_interface);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;


  EquipmentInterface.find(id)
    .then(function (equipment_interface) {
      equipment_interface = extend(equipment_interface, input);

      return EquipmentInterface.update(id, equipment_interface);
    })
    .then(function (equipment_interface) {
      res.send(equipment_interface);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  EquipmentInterface.find(id)
    .then(function(equipment_interface) {

      EquipmentInterface.destroy(id, {equipment_interface: equipment_interface})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);

    });

};
