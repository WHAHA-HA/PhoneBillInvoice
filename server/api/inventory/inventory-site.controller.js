
var InventorySite = require('./inventory-site.model');
var extend = require('cloneextend').cloneextend;

exports.delete = function (req, res, next) {

  var id = req.params.id;

  InventorySite.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);

};
