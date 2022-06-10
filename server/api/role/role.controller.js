var Role = require('../../components/role'),
  extend = require('cloneextend').cloneextend;
var ModuleRegistry = require('../../components/module');

var relations  = ['user_in_roles', 'permissions', 'permissions.permission_action', 'permissions.permission_filter', 'permissions.permission_filter.filter'];

var prepareEntity = function (permission) {
  var modules = ModuleRegistry.all();
  permission.module = findModule(modules, permission.module_id);
  permission.filters = permission.permission_filters.map(function (x) {
    return x.filter;
  })
};
function findModule(list, key) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === key) {
      return list[i]
    }
  }
}
exports.index = function (req, res, next) {
  var query = req.query.filter ? JSON.parse(req.query.filter) : {};


  Role.findAll(query, {with: relations})
    .then(function (roles) {

      // Modules are not in db so need to resolve manually
      roles.forEach(function (role) {
        role.permissions.forEach(function (permission) {
          prepareEntity(permission);
        })
      });

      res.send(roles);
    })
    .catch(next);


};


exports.show = function (req, res, next) {
  Role.find(req.params.id, {with: relations})
    .then(function (role) {
      res.send(role);
    })
    .catch(next);
};


exports.create = function (req, res, next) {

  var input = req.body;

  Role.create(input, {with: relations})
    .then(function (role) {
      res.send(role);
    })
    .catch(next);

};

exports.update = function (req, res, next) {

  var input = req.body,
    id = req.params.id;

  Role.find(input.id).then(function (role) {
      return extend(role, input);
    })
    .then(function (role) {
      Role.update(id, role, {with: relations})
        .then(function (role) {

          role.permissions.forEach(function (permission) {
            prepareEntity(permission);
          });

          res.send(role);
        })
    })
    .catch(next);

};


exports.delete = function (req, res, next) {

  /**
   * remove role with history info
   */

  var input = req.body,
    id = req.params.id;

  Role.find(id, {with: relations})
    .then( function(role){

      Role.destroy(id, {role: role})
        .then(function () {
          res.status(200).end();
        })
        .catch(next);

  });


};
