/**
 *
 */
(function () {
    'use strict';

    function ProjectsCtrl($scope, $state, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, $timeout, Project, Employee, uiGridConstants, Dictionary) {

        $lcmaPage.setTitle('Project List');

        var _this = this;


        _this.layout = {
          orientation: 'vertical',
          list: {
            size: 25
          },
          details: {
            size: 75
          }
        };

        _this.layoutAction = function (action) {
          _this.layout.list.size = 80;
        };

        _this.onSettingsUpdate = $scope.onSettingsUpdate = function (settings) {
            lcmaGrid.updateFromSettings(settings, _this.gridApi);
        };


    var lcmaGrid = $lcmaGrid({
      settingKey: 'project.list.grid',
      exporterCsvFilename: 'projects.csv',
      multiSelect: false,
      noUnselect: true,
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.projectQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.projectQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });

        api.selection.on.rowSelectionChanged($scope, function (row) {
          _this.select(row.entity);
        });
      }

    })
    .addColumn('project_id', 'Project ID', {width: 200})
    .addColumn('name', 'Project Name', {width: 200})
    .addRelColumn('owner_id', "Owner", {
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.owner.first_name}} {{row.entity.owner.last_name}}</div>',
        width: 120,
        filter: {
            term: -1,
            type: uiGridConstants.filter.SELECT,
            selectOptions: Employee.findAll(),
            map: function (x) {
                return {value: x.id , label: x.full_name};
            }
        }
    })
    .addRelColumn('status_id', 'Status',{
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status.value}}</div>',
        width: 120,
        filter: {
            term: -1,
            type: uiGridConstants.filter.SELECT,
            selectOptions: Dictionary.getDictionary('project-status'),
            map: function (x) {
                return {value: x.key , label: x.value};
            }
        }
    })
    .addColumn('description', 'Description', {width: 300});

    var grid = _this.gridOptions =  lcmaGrid.options();


    /**
     * Initiates Project remove.
     */
    $scope.remove = _this.remove = function () {

      if (_this.gridApi.selection.getSelectedRows().length === 0)
        return;

      var project = _this.gridApi.selection.getSelectedRows()[0];

      $lcmaDialog.remove({
        message: ' project ' + project.name
      }).result.then(function () {
        Project.destroy(project.id)
          .then(function(result) {

            // select first one,
            if (_this.gridOptions.data.length) {
              //need timeout to make sure grid element actually associated with variable
              $timeout(function() {
                _this.select(_this.gridOptions.data[0]);
                _this.gridApi.selection.selectRow(_this.gridOptions.data[0]);
              });
            }
            else {
              _this.currentSelection = null;
            }

          });
      });
    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.projectQuery.limit = _this.pager.size;
        _this.projectQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds sites query.
     */
    _this.projectQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1,
      orderBy: [['name', 'ASC']]
    };

    /**
     * Clear the section with empty data
     */
    _this.addProject = function () {
      _this.currentSelection = null;
      _this.gridApi.selection.clearSelectedRows();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Selects an item
     * @param item
     */
    _this.select = function (item) {
      _this.currentSelection = item;
      _this.resolvesEdit = {
        '$currentProject': item
      };

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.projectQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };

    _this.refresh = function () {
      Project.findAll({filter: JSON.stringify(_this.projectQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;

          // select first immediately
          if (data.length) {
            //need timeout to make sure grid element actually associated with variable
            $timeout(function() {
              _this.select(data[0]);
              _this.gridApi.selection.selectRow(grid.data[0]);
            });
          }
          else {
            _this.currentSelection = null;
          }


        });
    };

    //Discard content and reload original one
    _this.onDismiss = function(create) {

      if (create) {
        return;
      }

      var selectedRows = _this.gridApi.selection.getSelectedRows();
      if (selectedRows.length > 0) {
        //_this.currentSelection = angular.copy(selectedRows[0]);
        _this.resolvesEdit = {
          '$currentProject': selectedRows[0]
        };
      }

    };

    /**
     *
     * @param data: object return from create/update
     * @param create: boolean
     */
    _this.onChange = function(data, create) {

      if (create) {

        grid.data.push(data);
        _this.currentSelection = data;

        $timeout(function() {

          //_this.gridApi.selection.selectRow(grid.data[0]);
          _this.gridApi.selection.selectRow(data); //select newly created building
        });

        $lcmAlert.success('New Project has been created');

      }
      else {

        var selectedRows = _this.gridApi.selection.getSelectedRows();
        if (selectedRows.length > 0) {
          selectedRows[0] = data;
        }

        $lcmAlert.success('Project has been updated');

      }

    };

    _this.refresh();

  }

  angular.module('lcma')
    .controller('ProjectsCtrl', ProjectsCtrl);


}());
