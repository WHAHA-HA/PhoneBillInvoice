'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.invoices', {
        url: '/invoices',
        views: {
          "main@app": {
            templateUrl: 'app/invoices/list/invoices-list.html',
            controller: 'InvoicesCtrl as ctx'
          }
        }
      })
      .state('app.invoiceDetails', {
        url: '/invoices/:id',
        resolve: {
          chargeId: function () {
            return null;
          }
        },        
        views: {
          "main@app": {
            templateUrl: 'app/invoices/show/invoices-show.html',
            controller: 'InvoiceShowCtrl as ctx'
          }
        }
      })
      .state('app.invoiceChargeDetails', {
        url: '/invoices/:id/charge/:charge',
        resolve: {
          chargeId: function ($stateParams) {
            return $stateParams.charge;
          }
        },        
        views: {
          "main@app": {
            templateUrl: 'app/invoices/show/invoices-show.html',
            controller: 'InvoiceShowCtrl as ctx'
          }
        }
      });
  });
