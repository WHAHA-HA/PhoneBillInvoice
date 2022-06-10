'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  8082,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
    'mongodb://localhost/caapp'
  },
  postgree_main: {
    user: 'srcloop',
    password: 'sqlsrcadm!n',
    database: 'Client_QA',
    host: 'lcma-uat.cr1my15mhsmj.us-east-1.rds.amazonaws.com',
    port: 5432
  }
};
