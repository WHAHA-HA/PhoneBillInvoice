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
   host: 'pgsqlinstance.cr1my15mhsmj.us-east-1.rds.amazonaws.com',
   port: 5432
  },*/
   /*postgree_main: {
    user: 'andrejkaurin',
    password: '',
    database: 'Client_Nikhil',
    host: 'localhost',
    port: 5433
  },*/
  postgree_main: {
    user: 'postgres',
    password: 'postgres',
    database: 'Client_QA',
    host: 'localhost',
    port: 5433
  },
  seedDB: true
};

