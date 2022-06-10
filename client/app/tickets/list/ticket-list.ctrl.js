/**
 *
 */
(function () {
    'use strict';

  function TicketsCtrl($scope, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog,
                       Ticket, User, uiGridConstants, Dictionary, $me, $timeout, $lcmaRole) {

    $lcmaPage.setTitle('Ticket List');

    var _this = this;

    _this.layout = {
      orientation: 'vertical',
      list: {
        size: 35
      },
      details: {
        size: 65
      }
    };

    _this.layoutAction = function (action) {
      _this.layout.list.size = 80;
    };

    _this.onSettingsUpdate = function (settings) {
      lcmaGrid.updateFromSettings(settings, _this.gridApi);
    };
    
     var lcmaGrid = $lcmaGrid({
      settingKey: 'ticket.list.grid',
      exporterCsvFilename: 'tickets.csv',
      multiSelect: false,
      noUnselect: true,
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.ticketQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.ticketQuery)
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
      .addColumn('id', 'Ticket #')
      .addColumn('title', 'Title', {width:'*'})
      .addColumn('email', 'Email');

    if ($lcmaRole.isUnrestricted($me)) {

      lcmaGrid = _this.gridOptions = lcmaGrid.addRelColumn('assignee_id', "Assignee", {
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.assignee.username}}</div>',
        width: 120,
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: User.findAll(),
          map: function (x) {
            return {value: x.id, label: x.username};
          }
        }
      });
    }

    lcmaGrid = _this.gridOptions = lcmaGrid.addRelColumn('type_id', "Type", {
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.type.value}}</div>',
      filter: {
        term: -1,
        type: uiGridConstants.filter.SELECT,
        selectOptions: Dictionary.getDictionary('ticket-type'),
        map: function (x) {
          //_this.inventoryTypes.push(x);
          return {value: x.key , label: x.value};
        }
      }
    })
    .addDateColumn('created_date', 'Created Date');
    var grid = _this.gridOptions = lcmaGrid.options();




    /**
     * Initiates Ticket remove.
     */
        $scope.removeTicket = _this.removeTicket = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;
            var ticket = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Ticket ' + ticket.title
            }).result.then(function () {
                Ticket.destroy(ticket.id)
                        .then(function (result) {

                            // select first one,
                            if (_this.gridOptions.data.length) {
                                //need timeout to make sure grid element actually associated with variable
                                $timeout(function () {
                                    _this.select(_this.gridOptions.data[0]);
                                    _this.gridApi.selection.selectRow(_this.gridOptions.data[0]);
                                });
                            } else {
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
        _this.ticketQuery.limit = _this.pager.size;
        _this.ticketQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds tickets query.
     */
    _this.ticketQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1,
      orderBy: [['id', 'ASC']]
    };



    /**
     * Opens add ticket dialog
     */
    _this.addTicket = function () {

      _this.currentSelection = null;
      _this.gridApi.selection.clearSelectedRows();

    };

    /**
     * Opens update ticket dialog
     */
    $scope.editTicket = _this.editTicket = function (ticket) {

      $uibModal.open({
        templateUrl: 'app/tickets/edit/ticket-edit.html',
        controller: 'TicketEditCtrl',
        windowClass: 'app-modal-window',
        backdrop: 'static',
        resolve: {
          $currentTicket: function () {
            return ticket;
          }
        }
      }).result.then(function (data) {
        angular.extend(ticket, data);
        $lcmAlert.success('Ticket info has been updated.');
      });

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
        '$currentTicket': item
      };
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.ticketQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };



    _this.refresh = function () {

      Ticket.findAll({filter: JSON.stringify(_this.ticketQuery)})
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
          '$currentBuilding': selectedRows[0]
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

        $lcmAlert.success('New Ticket has been created');

      }
      else {

        var selectedRows = _this.gridApi.selection.getSelectedRows();
        if (selectedRows.length > 0) {
          selectedRows[0] = data;
        }

        $lcmAlert.success('Ticket has been updated');

      }

    };


    if (!$lcmaRole.isUnrestricted($me)) {
      _this.ticketQuery.where['assignee_id'] = {'in': [$me.id]};
    }
    _this.refresh();


  }

  angular.module('lcma')
    .controller('TicketsCtrl', TicketsCtrl);

}());
