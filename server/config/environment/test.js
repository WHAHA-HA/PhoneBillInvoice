'use strict';

// Development specific configuration
// Please change this file to development.js when you are using with custom information
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/caapp-dev'
  },
/* postgree_main: {
   user: 'srcloop',
   password: 'sqlsrcadm!n',
   database: 'Client_QA',
   host: 'lcma-uat.cr1my15mhsmj.us-east-1.rds.amazonaws.com',
   port: 5432
  },*/
   postgree_main: {
     user: 'andrejkaurin',
     password: '',
     database: 'Client_QA',
     host: 'localhost',
     port: 5432
  },
  seedDB: true
};

/*
 postgres://username:password@lcma-uat.cr1my15mhsmj.us-east-1.rds.amazonaws.com:5432/Client_QA
* */
