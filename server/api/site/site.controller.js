var Site = require('./site.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query &&  req.query.filter ? JSON.parse(req.query.filter) : {};

  Site.findAllWithPaging(query, {with: ['parent', 'vendor', 'sites', 'equipments', 'equipments.equipment_interfaces', 'building', 'type']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;



  Site.find(id, {with: ['parent', 'vendor', 'sites', 'equipments', 'equipments.equipment_interfaces', 'building', 'type']})
    .then(function (site) {
      res.send(site);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  // TODO: Add validation

  Site.create(input, {with: ['parent', 'vendor', 'sites', 'equipments', 'equipments.equipment_interfaces', 'building' ,'type']})
    .then(function (site) {
      res.send(site);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation

  Site.find(id)
    .then(function (site) {
      site = extend(site, input);
      return Site.update(id, site, {with: ['parent', 'vendor', 'sites', 'equipments', 'equipments.equipment_interfaces', 'building', 'type']});
    })
    .then(function (site) {
      res.send(site);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Site.find(id, {with: ['parent', 'vendor', 'sites', 'equipments', 'equipments.equipment_interfaces', 'building']})
    .then(function(site) {

      Site.destroy(id, {site: site})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);

    });


};
