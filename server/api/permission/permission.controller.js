var Permission = require('../../components/permission');
var User = require('../../components/user');
var PermissionAction = require('../../components/permission-action');
var PermissionFilter = require('../../components/permission-filter');
var ModuleRegistry = require('../../components/module');
var extend = require('cloneextend').cloneextend;
var Promise = require('es6-promise').Promise;
var Token = require('../../components/token');

var prepareEntity = function (permission) {
  var modules = ModuleRegistry.all();
  permission.module = findModule(modules, permission.module_id);
  permission.filters = permission.permission_filters.map(function (x) {
    return x.filter;
  })
};


exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};
  Permission.findAllWithPaging(query, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']})
    .then(function (result) {

      // Modules are not in db so need to resolve manually
      result.items.forEach(function (permission) {
        prepareEntity(permission);
      });

      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Permission.find(id, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']})
    .then(function (permission) {
      prepareEntity(permission);
      res.send(permission);
    })
    .catch(next);
};

exports.me = function (req, res, next) {

  var token = Token.get(req);
  var id = token.iss;

  User.find(id, {with:['user_in_role']})
    .then(function (user) {
      return Permission.findAll({
        where: {
          role_id: {
            'in': user.user_in_role.map(function (x) {
              return x.role_id;
            })
          }
        }
      }, {with: ['permission_action']})
    })
    .then(function (permissions) {
      res.send(permissions);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  Permission.findAll({
      where: {
        role_id: {'===': input.role_id},
        module_id: {'===': input.module_id}
      }
    })
    .then(function (permissions) {
      if (permissions.length) {
        res.status(400).send({
          status: 400,
          errors: ['There is already permission defined for this role-module combination']
        });
        res.end();
      }
      else {

        return Permission.create({
            role_id: input.role_id,
            module_id: input.module_id
          }, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']})

          .then(function (permission) {

            var actionPromises = [];

            if (input.actions && input.actions.length) {
              input.actions.forEach(function (action) {
                actionPromises.push(PermissionAction.create({
                  permission_id: permission.id,
                  name: action
                }));
              });

              return Promise.all(actionPromises).then(function (actions) {
                permission.actions = actions;
                return permission;
              });
            }
            else {
              return permission;
            }
          })

          .then(function (permission) {

            var filterPromises = [];

            if (input.filters && input.filters.length) {
              input.filters.forEach(function (filter) {
                filterPromises.push(PermissionFilter.create({
                  permission_id: permission.id,
                  filter_id: filter.id
                }));
              });

              return Promise.all(filterPromises).then(function (filters) {
                permission.filters = filters;
                return permission;
              });
            }
            else {
              return permission;
            }
          })

          .then(function (permission) {
            return Permission.find(permission.id, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']});
          })
          .then(function (permission) {
            prepareEntity(permission);
            res.send(permission);
          });

      }
    })

    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation

  Permission.find(id, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']})
    .then(function (permission) {
      // Clear all first

      return PermissionAction.destroyAll({
          where: {
            permission_id: {
              '===': permission.id
            }
          }
        }, {permission_id: permission.id})
        .then(function () {
          return permission;
        });

    })
    .then(function (permission) {
      // Clear all first
      return PermissionFilter.destroyAll({
          where: {
            permission_id: {
              '===': permission.id
            }
          }
        }, {permission_id: permission.id})
        .then(function () {
          return permission;
        });

    })
    .then(function (permission) {

      var actionPromises = [];

      input.actions.forEach(function (action) {
        actionPromises.push(PermissionAction.create({
          permission_id: permission.id,
          name: action
        }));
      });

      return Promise.all(actionPromises).then(function (actions) {
        permission.actions = actions;
        return permission;
      });
    })

    .then(function (permission) {

      var filterPromises = [];

      input.filters.forEach(function (filter) {
        filterPromises.push(PermissionFilter.create({
          permission_id: permission.id,
          filter_id: filter.id
        }));
      });

      return Promise.all(filterPromises).then(function (filters) {
        permission.filters = filters;
        return permission;
      });
    })
    .then(function (permission) {
      return Permission.find(permission.id, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']});
    })
    .then(function (permission) {
      prepareEntity(permission);
      res.send(permission);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

    var id = req.params.id;

    PermissionAction.destroyAll({
        where: {
            permission_id: {
                '===': id
            }
        }
    }).then(function () {
        PermissionAction.destroyAll({
            where: {
                permission_id: {
                    '===': id
                }
            }
        }).then(function () {
            Permission.find(id)
                    .then(function (permission) {
                        Permission.destroy(id, {permission: permission})
                                .then(function () {
                                    res.sendStatus(200);
                                })
                                .catch(next);
                    });
        });
    });
};

function findModule(list, key) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === key) {
      return list[i]
    }
  }
}
