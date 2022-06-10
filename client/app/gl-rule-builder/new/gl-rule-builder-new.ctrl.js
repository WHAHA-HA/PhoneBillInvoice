/**
 *
 */
(function () {
    'use strict';

    function GlRuleBuilderNewCtrl($lcmaPage, $lcmAlert, $scope, $state, $lcmaGrid, Charge, $lcmaGridFilter, InvoiceChargeStatus, GlRuleField, GlCodeSegments, GlString, $lcmaPager, $timeout, GlRules, rule) {
        $lcmaPage.setTitle('New GL Rule');

        InvoiceChargeStatus.findAll().then(function (data) {
            _this.chargeTypes = data;
            GlRuleField.findAll().then(function (data) {
                _this.ruleFields = data;
                _this.refresh();
               
            });
        });

        


        var _this = this;
        _this.selectionVisible = true;
        _this.glRule = {};       
        _this.clause = {
            logic: "AND",
            operator: "==="
        };
        _this.increment = 1;
        
        var rulesGrid = _this.gridRulesOptions = $lcmaGrid({
            multiSelect: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableFiltering: false,
            enableSorting: false,
            onRegisterApi: function (api) {
                _this.gridRulesApi = api;
            }
        })
                .addColumn('number', "Clause #")
                .addColumn('logic', "And/Or", {
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.number==1?"":row.entity.logic}}</div>',
                    width: 100,
                    enableCellEdit: true,
                    showColumnFooter: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsArray: [
                        {id: "AND", value: 'AND'},
                        {id: "OR", value: 'OR'}
                    ]})
                .addColumn('chargeType.value', "Charge Type")
                .addColumn('field.value', "Field")
                .addColumn('operator', "Operator",{
                    width: 100,
                    enableCellEdit: true,
                    showColumnFooter: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsArray: [
                        {id: "=", value: 'Equals'},
                        {id: "<>", value: 'Not Equals'},
                        {id: "like", value: "Contains"}
                    ]})
                .addColumn('value', "Value", {
                    enableCellEdit: true,
                    width: 250
                })
                .options();

        var impactedChargesGrid = _this.gridImpactedChargesOptions = $lcmaGrid({            
            enableFiltering: false,
            enableSorting: false,
            onRegisterApi: function (api) {
                _this.gridImpactedChargesApi = api;
            }
        })
                .addColumn('chg_class', "Charge Type")
                .addColumn('sp_serv_id', "SPID")
                .addColumn('chg_desc_1', "Charge Desc", {width: '*'})
                .addCurrencyColumn('chg_amt', "Amount")
                .options();

        $scope.removeRule = function () {
            var items = _this.gridRulesApi.selection.getSelectedRows();
            if (items.length === 0)
                return;
            for (var i in items) {
                var index = rulesGrid.data.map(function (o) {
                    return o.number;
                }).indexOf(items[i].number);
                rulesGrid.data.splice(index, 1);
                for(i=0; i< rulesGrid.data.length;i++){
                    rulesGrid.data[i].number = i+1;
                }
                _this.increment = i+1;
            }
        };

        _this.addRule = function () {
            if (!_this.clause.chargeType || !_this.clause.field || !_this.clause.operator || !_this.clause.value || rulesGrid.data.length == 8) {
                return;
            }
            _this.clause.number = _this.increment++;
            rulesGrid.data.push(angular.copy(_this.clause));
            _this.clause = {logic: "AND", operator: "==="};
        };

        //step 3 and 4


        var gridStringsOptions = _this.gridStringsOptions = $lcmaGrid({
            multiSelect: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableFiltering: false,
            enableSorting: false,
            rowEquality: function (x, y) {
                return x.id === y.id;
            },
            onRegisterApi: function (api) {

                _this.gridStringsOptionsApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.query.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.query)
                            .applyAll(gridStringsOptions.columnDefs.filter(function (x) {
                                return x.enableFiltering;
                            }));

                    _this.refresh();
                });

                api.selection.on.rowSelectionChanged($scope, function (row) {

                    var existingRow = findRowByEntityId(_this.gridSelectedStringsOptions.data, row.entity.id);

                    if (row.isSelected && !existingRow) {
                        _this.gridSelectedStringsOptions.data.push(row.entity);
                        $timeout(function () {
                            _this.gridSelectedStringsOptionsApi.selection.selectRow(row.entity);
                        });

                    } else if (!row.isSelected && existingRow) {
                        _this.gridSelectedStringsOptions.data.splice(existingRow.index, 1);
                    }

                });

            }

        })
                .addColumn('full_string_formatted', "Full GL String", {width: 180})
                .addColumn('full_string_text', "GL String Desc", {width: 180})
                .options();

        function findRowByEntityId(list, id) {
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i].id === id) {
                    return {item: list[i], index: i};
                }
            }
        }

        var gridSelectedStringsOptions = _this.gridSelectedStringsOptions = $lcmaGrid({
            multiSelect: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableFiltering: false,
            enableSorting: false,
            rowEquality: function (x, y) {
                return x.id === y.id;
            },
            onRegisterApi: function (api) {

                _this.gridSelectedStringsOptionsApi = api;

                api.selection.on.rowSelectionChanged($scope, function (row) {
                    if (!row.isSelected) {
                        var existingRow = findRowByEntityId(_this.gridSelectedStringsOptions.data, row.entity.id);
                        _this.gridSelectedStringsOptions.data.splice(existingRow.index, 1);
                        _this.gridStringsOptionsApi.selection.unSelectRow(row.entity);
                    }
                });
            }

        })
                .addNumberColumn('apportion_pct', "Charge %", {enableCellEdit: true, width: 100})
                .addColumn('full_string_formatted', "Full GL String", {width: 180})
                .addColumn('full_string_text', "GL String Desc", {width: 180})
                .options();

        GlCodeSegments.findAll().then(function (data) {
            var columnDefaults = {
                width: 85,
                enableFiltering: true
            };
            for (var segment in data) {
                if (data[segment].id) {
                    var value = data[segment].value;
                    var name = data[segment].custom_key;
                    var col = angular.extend({}, columnDefaults, {}, {
                        field: name + "_obj.segment_value",
                        name: value,
                        displayName: value,
                        headerName: value
                    });
                    var col1 = angular.extend({}, columnDefaults, {}, {
                        field: name + "_obj.segment_desc",
                        name: value + '_desc',
                        displayName: value,
                        headerName: value
                    });
                    gridSelectedStringsOptions.columnDefs.push(col);
                    gridStringsOptions.columnDefs.push(col);
                    gridSelectedStringsOptions.columnDefs.push(col1);
                    gridStringsOptions.columnDefs.push(col1);
                }
            }
        });

        _this.pager = $lcmaPager({
            onGo: function () {
                _this.query.limit = _this.pager.size;
                _this.query.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });

        _this.query = {
            where: {},
            limit: _this.pager.size,
            offset: this.pager.from() - 1
        };

        _this.refresh = function () {
            _this.query.where['id'] = {'>': -(new Date().getMilliseconds())};
            _this.query.where['status'] = {'==': true};
            return GlString.findAll({filter: JSON.stringify(_this.query)}).then(function (data) {
                gridStringsOptions.data = data;
                _this.pager.total = data.$total;
                 if (rule) {
                    _this.showRule();
                }
            });
        };

        

        _this.saveRule = function (form) {
            if (!_this.glRule.rule_name || !_this.glRule.rule_desc) {
                return;
            }
            var obj = {
                rule_desc: _this.glRule.rule_desc,
                rule_name: _this.glRule.rule_name
            };
            var items = rulesGrid.data;
            if (items.length == 0) {
                $lcmAlert.error('Create at least 1 Rule.');
                return;
            }
            for (var i in items) {
                var t = Number(i) + 1;
                obj["fld" + t + "_name"] = items[i].field.custom_key;
                obj["fld" + t + "_match_value"] = items[i].value;
                obj["fld" + t + "_operator"] = {
                    operator: items[i].operator,
                    logic: items[i].logic,
                    chargeType: items[i].chargeType
                };
            }
            var gl_rules_glcodes = _this.gridSelectedStringsOptions.data;
            var rules_for_save = [];
            var sum = 0;
            for (var i in gl_rules_glcodes) {
                sum += gl_rules_glcodes[i].apportion_pct;
                var o = {apportion_pct: gl_rules_glcodes[i].apportion_pct, gl_string_id:gl_rules_glcodes[i].id};
                for (var t = 1; t < 10; t++) {
                    if (gl_rules_glcodes[i]["segment" + t + "_obj"]) {
                        o["gl_code_seg" + t] = gl_rules_glcodes[i]["segment" + t + "_obj"].segment_value;
                    }
                }
                rules_for_save.push(o);
            }
            if (sum != 100 && sum != 1) {
                $lcmAlert.error('Sum of Charge Apportion must be 100%.');
                return;
            }
            var objectForSave = {gl_rule: obj, gl_rule_glcodes: rules_for_save};            
            if(!rule) {
                GlRules.create(objectForSave).then(function (val) {
                    $lcmAlert.success('GL Rule has been saved');
                    $state.go('app.glrulebuilder');
                });
            } else {
                GlRules.update(rule.id, objectForSave).then(function (val) {
                    $lcmAlert.success('GL Rule has been updated');
                    $state.go('app.glrulebuilder');
                });
            }
        };

        _this.chargeQuery = {
            where: {}
        };

        _this.filter = {};


        _this.runRule = function () {

            if (_this.filter.account_numbers) {
                _this.chargeQuery.where['account_numbers'] = _this.filter.account_numbers;
            } else {
                delete _this.chargeQuery.where['account_numbers'];
            }


            if (_this.filter.vendor_ids) {
                _this.chargeQuery.where['vendor_ids'] = _this.filter.vendor_ids;
            } else {
                delete _this.chargeQuery.where['vendor_ids'];
            }

            if (_this.filter.start_date) {
                /**
                 * remove timezone and converts it to string  : 2015-09-12
                 */
                _this.chargeQuery.where['start_date'] = '' + _this.filter.start_date.getFullYear()
                        + '-' + ("0" + (_this.filter.start_date.getMonth() + 1)).slice(-2)
                        + '-' + ("0" + (_this.filter.start_date.getDate())).slice(-2);
            } else {
                delete _this.chargeQuery.where['start_date'];
            }


            if (_this.filter.end_date) {
                _this.chargeQuery.where['end_date'] = '' + _this.filter.end_date.getFullYear()
                        + '-' + ("0" + (_this.filter.end_date.getMonth() + 1)).slice(-2)
                        + '-' + ("0" + (_this.filter.end_date.getDate())).slice(-2);
            } else {
                delete _this.chargeQuery.where['end_date'];
            }

            _this.chargeQuery.where.gl_fields = rulesGrid.data;

            return Charge.filters(
                    {
                        params: {filter: JSON.stringify(_this.chargeQuery)}
                    })
                    .then(function (response) {
                        if (response.status === 200) {
                            _this.gridImpactedChargesOptions.data = response.data.items;
                        }

                    });
        };
        
        _this.showRule = function(){
            _this.glRule = rule;
            
            var items = [];
            for(var i in rule.gl_rules_glcodes){
               var obj = _this.gridStringsOptions.data.filter(function(o){
                    return o.id == rule.gl_rules_glcodes[i].gl_string_id;
                })[0];
                if(obj){
                    obj.apportion_pct = rule.gl_rules_glcodes[i].apportion_pct;
                    items.push(obj);                
                }
            }
            _this.gridSelectedStringsOptions.data = items;
            
            rulesGrid.data = [];
            for (var i = 1; i < 9; i++) {
                var l = rule['fld' + i + '_operator'] ? rule['fld' + i + '_operator'].logic : "";
                var o = rule['fld' + i + '_operator'] ? rule['fld' + i + '_operator'].operator : "";
                var c = rule['fld' + i + '_operator'] ? rule['fld' + i + '_operator'].chargeType : "";
                if (i == 1) {
                    l = "";
                }
                if(rule['fld' + i + '_operator']){
                    rulesGrid.data.push({
                        number: i,
                        logic: l,
                        operator: o,
                        chargeType: c,
                        field: _this.ruleFields.filter(function(o){
                            return rule['fld' + i + '_name'] == o.custom_key;
                        })[0],
                        value: rule['fld' + i + '_match_value']
                    });
                    _this.increment = i+1;
                }
            }
        };

    }

    angular.module('lcma')
            .controller('GlRuleBuilderNew', GlRuleBuilderNewCtrl);

}());
