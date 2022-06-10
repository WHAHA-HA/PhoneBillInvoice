var Building = require('./building.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};
  console.log(query);

  Building.findAllWithPaging(query)
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Building.find(id)
    .then(function (building) {
      res.send(building);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  // TODO: Add validation

  Building.create(input)
    .then(function (building) {
      res.send(building);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation

  Building.find(id)
    .then(function (building) {
      building = extend(building, input);
      return Building.update(id, building);
    })
    .then(function (building) {
      res.send(building);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Building.find(id)
    .then(function(building) {
      Building.destroy(id, {building: building})
      .then(function () {
        res.sendStatus(200);
      })
        .catch(next);
    });

};
