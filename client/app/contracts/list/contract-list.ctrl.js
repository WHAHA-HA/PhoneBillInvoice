'use strict';

angular.module('lcma')
  .controller('ContractsCtrl', function ($scope, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $lcmaDialog, invoiceService, Contract, uiGridConstants, Vendor) {

    $lcmaPage.setTitle('Contracts');

    var _this = this;

   /* _this.tree = {
      data: [],
      colDefs: [
        {field: 'name', displayName: ' ', cellTemplate: '<a ui-sref="app.contractDetails({id: row.branch[\'id\']})"><i class="fa fa-eye"></i></a>'},
        {field: 'company_name', displayName: 'Company'},
        //{field: 'company_sign_date', displayName: 'Company Signed', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'vendor', displayName: 'Vendor', cellTemplate: '<span>{{row.branch.vendor.name}}</span>'},
        //{field: 'vendor_sign_date', displayName: 'Vendor Signed', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'effective_date', displayName: 'Effective Date', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'termination_date', displayName: 'Termination Date', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'term_months', displayName: 'Term'},
        {field: 'committed_value', displayName: 'Committed Value', cellTemplate: '<span>{{row.branch[col.field] | currency}}</span>'}

      ]
    };*/

    $scope.onSettingsUpdate = function (settings) {
        lcmaGrid.updateFromSettings(settings, _this.contractsGridApi);
    };
    /**
     * Holds grid settings
     * @type {settings}
     */
    var lcmaGrid = $lcmaGrid({
      exporterCsvFilename: 'contracts.csv',
      enableSorting: true,      
      settingKey: 'contract.list.grid',
      enableFiltering: true,
      showTreeExpandNoChildren: false,
      onRegisterApi: function (api) {
        _this.contractsGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.contractQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.contractQuery)
            .apply('name')
            .apply('company_name')
            .apply('company_sign_date', 'date')
            .apply('vendor_id', 'number')
            .apply('vendor_sign_date', 'date')
            .apply('effective_date', 'date')
            .apply('termination_date', 'date')
            .apply('term_months', 'number')
            .apply('committed_value', 'currency')
          ;

          _this.refresh();

        });
      }
    })

      .addColumn('name', 'Name', {
        cellTemplate: '<div class="ui-grid-cell-contents"><a ng-style="{\'padding-left\': grid.options.treeIndent * (row.treeLevel+1) + \'px\'}" ui-sref="app.contractDetails({id: row.entity.id})">{{row.entity.name}}</a></div>',
        width: 150
      })
      .addColumn('company_name', 'Company')
      .addDateColumn('company_sign_date', 'Company Signed')
      .addRelColumn('vendor_id', "Vendor", {
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.vendor.name}}</div>',
        width: 100,
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: Vendor.findAll(),
          map: function (x) {
              return {value: x.id , label: x.name};
          }
        }
      })
      .addDateColumn('vendor_sign_date', 'Vendor Signed', {
          width: 100
      })
      .addDateColumn('effective_date', 'Effective Date',{
          width: 100
      })
      .addDateColumn('termination_date', 'Termination Date')
      .addNumberColumn('term_months', 'Term (months)')
      .addCurrencyColumn('committed_value', 'Committed Value');
      var grid = _this.contractsGrid =  lcmaGrid.options();

    /**
     * Initiates dialog for contract edit.
     */
    $scope.editContract = _this.editContract = function (contract) {
      $uibModal.open({
        templateUrl: 'app/contracts/edit/contract-edit.html',
        controller: 'ContractEditCtrl',
        size: 'lg',
        backdrop: 'static',
        resolve: {
          $currentContract: function () {
            return contract;
          }
        }
      }).result.then(function (data) {
        angular.extend(contract, data);
        $lcmAlert.success('Contract info has been updated');
      });
    };

     /**
     * Initiates contract remove.
     */
    $scope.removeContract = _this.removeContract = function (contract, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this contract?'
      }).result.then(function () {
        //grid.data.splice(index, 1);
        Contract.destroy(contract.id);
      });
    };


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.contractQuery.limit = _this.pager.size;
        _this.contractQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.contractQuery = {
      where: {
        master_id: {'===' : null}
      },
      limit: _this.pager.size,
      offset: this.pager.from() - 1,
     // orderBy: [['date_issued', 'DESC'], ['vendor_id', 'ASC'], ['sp_inv_num', 'ASC']]
    };


    /**
     * Opens add contract dialog
     */
    _this.newContract = function () {

      $uibModal.open({
        templateUrl: 'app/contracts/new/contract-new.html',
        controller: 'ContractNewCtrl',
        size: 'lg',
        backdrop: 'static',
      }).result.then(function (contract) {
          _this.refresh();
        $lcmAlert.success('Contract has been created');
      });

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.contractQuery.where = {};
      _this.contractsGridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.contractsGridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {
      _this.contractQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Contract.findAll({filter: JSON.stringify(_this.contractQuery)})
        .then(function (data) {
            function calculateLevel(obj, level, temp){
                for(var i in obj.children){
                    obj.children[i].$$treeLevel = level;
                    temp.push(obj.children[i]);
                    if(obj.children[i].children && obj.children[i].children.length>0){
                        calculateLevel(obj.children[i], level+1, temp);
                    }
                }
            }
            var temp = [];
            for(var i =0 ; i< data.length;i++){
                data[i].$$treeLevel = 0;
                temp.push(data[i]);
                calculateLevel(data[i], 1, temp);
            }
            grid.data = temp;
            _this.pager.total = data.$total;

            //_this.tree.data = data;
            return data;
        });
    };

    _this.refresh();
  });
