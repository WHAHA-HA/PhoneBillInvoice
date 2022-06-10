/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var auth = require('./components/auth');
var path = require('path');


module.exports = function(app) {
  var appConfig = require( "../config.json" );

  // Insert routes below
  app.use('/api/invoice', auth, require('./api/invoice'));
  app.use('/api/charge', auth, require('./api/charge'));
  app.use('/api/note', auth, require('./api/note'));
  app.use('/api/dispute', auth, require('./api/dispute'));
  app.use('/api/dispute-category', auth, require('./api/dispute-category'));
  app.use('/api/account', auth, require('./api/account'));
  app.use('/api/audit', auth, require('./api/audit'));
  app.use('/api/audit_rate', auth, require('./api/audit_rate'));
  app.use('/api/user', auth, require('./api/user'));
  app.use('/api/vendor', auth, require('./api/vendor'));
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/history', auth, require('./api/history'));
  app.use('/api/stat', auth, require('./api/stat'));
  app.use('/api/order', auth, require('./api/order'));
  app.use('/api/order-service', auth, require('./api/order-service'));
  app.use('/api/contract', auth, require('./api/contract'));
  app.use('/api/document', auth, require('./api/document'));
  app.use('/api/site', auth, require('./api/site'));
  app.use('/api/dictionary', auth, require('./api/dictionary'));
  app.use('/api/role', auth, require('./api/role'));
  app.use('/api/permission', auth, require('./api/permission'));
  app.use('/api/content-filter', auth, require('./api/content-filter'));
  app.use('/api/module', auth, require('./api/module'));
  app.use('/api/building', auth, require('./api/building'));
  app.use('/api/contacts', auth, require('./api/contact'));
  app.use('/api/equipments', auth, require('./api/equipment'));
  app.use('/api/report', auth, require('./api/report'));
  app.use('/api/inventory', auth, require('./api/inventory'));
  app.use('/api/employees', auth, require('./api/employee'));
  app.use('/api/ticket', auth, require('./api/ticket'));
  app.use('/api/project', auth, require('./api/project'));
  app.use('/api/customers', auth, require('./api/customer'));
  app.use('/api/setting', auth, require('./api/setting'));
  app.use('/api/theme', require('./api/theme'));
  app.use('/api/gl_codes', require('./api/gl_code'));
  app.use('/api/gl_string', require('./api/gl_string'));
  app.use('/api/inventory_gl_string', require('./api/inventory_gl_string'));
  app.use('/api/gl_rules', require('./api/gl_rule'));
  app.use('/api/equipment-interfaces', auth, require('./api/equipment_interface'));
  app.use('/api/performance', auth, require('./api/performance'));
  app.use('/api/utilization', auth, require('./api/utilization'));
  app.use('/api/recon', auth, require('./api/recon'));


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|vendor|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      //res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      console.log('Resolving index with version: ' + appConfig.version);
      res.render(path.resolve(app.get('appPath') + '/main.html'), {
        version: appConfig.version || '0.0.0'
      });
    });
};
