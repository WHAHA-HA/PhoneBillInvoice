var Setting = require('./setting.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

  Setting.findAllWithPaging(query)
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Setting.find(id)
    .then(function (setting) {
      res.send(setting);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body,
    id = input.id;

  // TODO: Add validation
  if (id) {
    Settings.update(id)
      .then(function (setting) {
        res.send(setting);
      })
      .catch(next);
  }
  else {
    Setting.create(input)
      .then(function (setting) {
        res.send(setting);
      })
      .catch(next);
  }

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation

  Setting.find(id)
    .then(function (setting) {
      setting = extend(setting, input);
      return Setting.update(id, setting);
    })
    .then(function (setting) {
      res.send(setting);
    })
    .catch(next);
};

exports.save = function (req, res, next) {
  var input = req.body,
    key = req.body.key,
    value = req.body.value,
    user_id = req.body.user_id;

  var query = {
    where: {
      key: key,
      value: value
    }
  };

  if (user_id) {
    query.where.user_id = user_id;
  }

  // TODO: Add validation

  Setting.findAll(query)
    .then(function (setting) {
      setting = extend(setting, input);
      return Setting.update(id, setting);
    })
    .then(function (setting) {
      res.send(setting);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Setting.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);

};
