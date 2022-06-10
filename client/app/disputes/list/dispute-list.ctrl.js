'use strict';

angular.module('lcma')
  .controller('DisputesCtrl', function ($scope, $location, $lcmAlert, $lcmaPage, $lcmaPager, $lcmaGrid, $lcmaGridFilter, $uibModal, uiGridConstants, Dispute, DisputeCategory, User, Dictionary) {

    $lcmaPage.setTitle('Dispute List');

    var _this = this;

    $scope.onSettingsUpdate = function (settings) {
        lcmaGrid.updateFromSettings(settings, _this.gridApi);
    };   

    /**
     * Disputes grid definition
     */
    var lcmaGrid = $lcmaGrid({
      enableRowHeaderSelection: true,
      exporterCsvFilename: 'disputes.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.disputeQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.disputeQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });

      }

    })
      .addColumn('dispute_id', "Dispute ID", {
        width: 140,
        cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref=" app.disputeEdit({id: row.entity.id}) " >{{row.entity.dispute_id || \'View\'}}</a></div>'
      })
      .addRelColumn('status', "Dispute Status", {
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status_obj.value}}</div>',
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: Dictionary.getDictionary('dispute-status'),
          map: function (x) {
            //_this.inventoryTypes.push(x);
            return {value: x.key , label: x.value};
          }
        }
      })
      .addDateTimeColumn('disp_stat_dt', "Last Update")
      .addRelColumn('user_id', "Filed By", {
          cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.user.first_name}} {{row.entity.user.last_name}}</div>',
            width: 120,
            filter: {
             term: -1,
             type: uiGridConstants.filter.SELECT,
             nulls : true,
             selectOptions: User.findAll(),
             map: function (x) {
                    return {value: x.id , label: x.first_name + " " + x.last_name};
                 }
            }
      })
      .addDateColumn('created_at', "Filed Date")
      .addRelColumn('category_id', "Dispute Category",{
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.category.name}}</div>',
            width: 120,
            filter: {
             term: -1,
             type: uiGridConstants.filter.SELECT,
             nulls : true,
             selectOptions: DisputeCategory.findAll(),
             map: function (x) {
                    return {value: x.id , label: x.name};
                 }
            }
      })
      .addCurrencyColumn('total_amount', "Billed Charges")
      .addCurrencyColumn('calculated_amount', "Calculated Charges", {width: 140})
      .addCurrencyColumn('disputed_amount', "Total Dispute",{
           cellTemplate: '<div class="ui-grid-cell-contents">{{(row.entity.total_amount-row.entity.calculated_amount) | currency}}</div>'
      })
      .addCurrencyColumn('dispute_value_awarded', "Dispute Awarded")
      .addCurrencyColumn('payback_amount', "Payback Amount", {
           cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.calculatePaybackAmount(row.entity) | currency}}</div>'
      })
      .addCurrencyColumn('amount_withheld', "Withheld", {
                     cellTemplate: "<div class=\"ui-grid-cell-contents\">{{row.entity.dispute_withheld > 0 ? (row.entity.dispute_withheld < row.entity.dispute_charges.length ? 'Partially Witheld' : 'Full Witheld') : 'Not Witheld'}}</div>"

      });
      var grid = _this.gridOptions =  lcmaGrid.options();
      
    $scope.calculatePaybackAmount = function (obj) {
                    return (obj.dispute_withheld === obj.dispute_charges.length) ?
                            (obj.dispute_value_awarded && obj.dispute_value_awarded < obj.disputed_amount ?
                                    (obj.disputed_amount - obj.dispute_value_awarded)
                                    : "")
                            : "";
                };
    /**
     * Opens view dispute dialog
     */
    $scope.viewDisputeDetails = _this.viewDispute = function (dispute_id) {

      $uibModal.open({
        templateUrl: 'app/disputes/edit/dispute-edit.html',
        controller: 'DisputeEditCtrl',
        backdrop: 'static',
        size: 'vlg',
        resolve: {
          disputeId: function () {
            return dispute_id;
          }
        }
      });

    };


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.disputeQuery.limit = _this.pager.size;
        _this.disputeQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds invoice query.
     */
    _this.disputeQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.disputeQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {

      _this.disputeQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Dispute.findAll({filter: JSON.stringify(_this.disputeQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;

          return data;
        });
    };

    _this.refresh();
  });
