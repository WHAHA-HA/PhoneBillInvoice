var ModuleRegistry = require('../../components/module');

exports.index = function (req, res, next) {

  res.send(ModuleRegistry.all());

};

