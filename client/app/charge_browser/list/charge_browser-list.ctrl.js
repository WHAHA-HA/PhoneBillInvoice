/**
 * Created by bear on 4/21/16.
 */
(function () {
  'use strict';

  function ChargeBrowserCtrl($scope, $lcmaGrid, $lcmAlert, $timeout, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, Charge, Invoice, ChargeBrowserService, Dispute) {

    $lcmaPage.setTitle('Charge Browser');

    var _this = this;

    _this.filter = {};

    $scope.onSettingsUpdate = function (settings) {
        lcmaGrid.updateFromSettings(settings, _this.gridApi);
      };

    var lcmaGrid = ChargeBrowserService.listGridSettings({
      settingKey: 'chargesGrid',
      exporterCsvFilename: 'invoices.csv',
      flatEntityAccess: true,
      enableRowHeaderSelection: true,
      enableSelectAll: true,
      fastWatch: true,
      onReady: function(event) {
        event.api.sizeColumnsToFit();
      },
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.chargeQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.chargeQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));
          _this.refresh();

        });

        api.selection.on.rowSelectionChanged($scope, function (row) {

            _this.selectionError = true;

            if (!_this.gridApi)
                return false;

            var selected = _this.gridApi.selection.getSelectedRows();

            for (var i in selected) {
                if (selected[0].acct_level_1 !== selected[i].acct_level_1 || selected[0].invoice_id !== selected[i].invoice_id) {
                    return false;
                }
            }


            /**
            * check this charge is already included in existing disputes of first row invoice
            */
            if (selected.length < 1) {
                return false;
            }

            _this.chargeExist = false;

            //http://localhost:9000/api/invoice?filter={"where":{"id":{">":-548},"header.status_code":{"in":[200,300]}},"limit":20,"offset":0,"orderBy":[["date_issued","DESC"],["vendor_id","ASC"],["sp_inv_num","ASC"]]}
            var ids = _.map(selected, 'id');

            var disputeChargeQuery = {
                where: {
                    charge_id: {
                        in: ids
                    }
                }
            };

            return Dispute.charges_disputed({params: {filter: JSON.stringify(disputeChargeQuery)}})
                .then(function(res) {
                    if (res.data.success !== true) {
                        _this.chargeExist = true;
                        _this.selectionError = true;
                        return;
                    }
                    else {
                        _this.chargeExist = false;
                        _this.selectionError = false;
                    }
                });

            /**
             * this query woks in invoice_detail page but not here
             */

            //var facepageQuery = {
            //    where: {
            //        invoice_id: {'==': selected[0].invoice_id},
            //        acct_level: {'==': 1}
            //    }
            //}
            //
            //return Invoice.facepage({params: {filter: JSON.stringify(facepageQuery)}}).then(function (res) {
            //    var facepages = res.data.items;
            //    if (facepages.length > 0 ) {
            //
            //        var disputesQuery = {
            //            where: {
            //                invoice_id: {'==': facepages[0].id}
            //            }
            //        };
            //
            //        return Dispute.findAll({filter: JSON.stringify(disputesQuery)}).then(function (disputes) {
            //
            //            for (var j=0; j < selected.length; j++) {
            //
            //                var item = selected[j];
            //
            //                for (var i=0; i< disputes.length; i++) {
            //
            //                    var disputeItem = disputes[i];
            //
            //
            //                    if (_.find(disputeItem.charges, { id: item.id})) {
            //                        _this.chargeExist = true;
            //                        _this.selectionError = true;
            //                        return;
            //                    }
            //
            //                }
            //            }
            //
            //            _this.chargeExist = false;
            //
            //            if (selected.length > 0) {
            //                _this.selectionError = false;
            //            }
            //            else {
            //                _this.selectionError = true;
            //            }
            //
            //
            //            return;
            //
            //        });
            //    }
            //});


        });

      }

    });
            var grid = _this.gridOptions  = lcmaGrid.options();

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.chargeQuery.limit = _this.pager.size;
        _this.chargeQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      },
      size: 50
    });


    /**
     * Holds invoice query.
     */
    _this.chargeQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };


    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      $timeout(function () {
        _this.chargeQuery.where = {};

        if (_this.gridApi) {
          _this.gridApi.core.clearAllFilters(true, true, true);
        }


        /**
         * clear all options
         */
        _this.filter.account_numbers = [];
        _this.filter.vendor_ids= [];
        _this.filter.start_date = null;
        _this.filter.end_date = null;

        _this.refresh();
      })
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));

      if (_this.gridApi) {
        _this.gridApi.exporter.csvExport('all', 'all', myElement);
      }

    };

    /**
     * Refreshes data against filter
     */
    _this.refresh = function () {


      /**
       * http://localhost:9000/api/charge/filters?filter={"where":{"vendor_ids":[1]},"limit":50,"offset":0}
       * http://localhost:9000/api/charge/filters?filter=%7B%22where%22:%7B%22vendor_ids%22:%5B1%5D,%22sp_name%22:%7B%22likei%22:%22VERI%25%22%7D,%22inv_status%22:%7B%7D,%22chg_class%22:%7B%7D,%22info_only_ind%22:%7B%7D,%22account_numbers%22:%5B%220000016928X25%22%5D,%22acct_level_1%22:%7B%22likei%22:%22098%25%22%7D%7D,%22limit%22:50,%22offset%22:0%7D
       */

      if (_this.filter.account_numbers) {
        _this.chargeQuery.where['account_numbers'] = _this.filter.account_numbers;
      }
      else {
        delete _this.chargeQuery.where['account_numbers'];
      }


      if (_this.filter.vendor_ids) {
          _this.chargeQuery.where['vendor_ids'] = _this.filter.vendor_ids; // in case multiple
          _this.chargeQuery.where['vendor_ids'] = [_this.filter.vendor_ids]; // in case single
      }
      else {
          delete _this.chargeQuery.where['vendor_ids'];
      }

      if (_this.filter.start_date) {
        /**
         * remove timezone and converts it to string  : 2015-09-12
         */
        _this.chargeQuery.where['start_date'] = '' + _this.filter.start_date.getFullYear()
          + '-' + ("0" + (_this.filter.start_date.getMonth() + 1)).slice(-2)
          + '-' + ("0" + (_this.filter.start_date.getDate())).slice(-2);
      }
      else {
        delete _this.chargeQuery.where['start_date'];
      }


      if (_this.filter.end_date) {
        _this.chargeQuery.where['end_date'] = '' + _this.filter.end_date.getFullYear()
          + '-' + ("0" + (_this.filter.end_date.getMonth() + 1)).slice(-2)
          + '-' + ("0" + (_this.filter.end_date.getDate())).slice(-2);
      }
      else {
        delete _this.chargeQuery.where['end_date'];
      }

      return Charge.filters(
        {
          params: {filter: JSON.stringify(_this.chargeQuery)}
        })
        .then(function (response) {
          if (response.status === 200) {

            grid.data = response.data.items;
            _this.pager.total = response.data.total;
          }

        });
    };

    _this.selectionError = true;

    _this.addDispute = function () {

      if (_this.selectionError) {
        $lcmAlert.error('Select only Disputes with same BAN and Invoice.');
        return;
      }
      Invoice.find(_this.gridApi.selection.getSelectedRows()[0].invoice_id).then(
        function (invoice) {
          $uibModal.open({
            templateUrl: 'app/disputes/new/dispute-new.html',
            controller: 'DisputeNewCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
              invoice: function () {
                return invoice;
              },
              charges: function () {
                return _this.gridApi.selection.getSelectedRows();
              }
            }
          }).result.then(function (newDispute) {
              _this.selectionError = true;
              $lcmAlert.success('Dispute has been created');
          });
        }
      );

    };
  }

  angular.module('lcma')
    .controller('ChargeBrowserCtrl', ChargeBrowserCtrl);
}());
