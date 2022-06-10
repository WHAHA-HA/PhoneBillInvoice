(function () {
    'use strict';

    angular.module('lcma')
        .factory('$lcmaConfirmation', function() {

            var _obj = {
                formId: null,
                formName: null
            };

            function Confirmation() {
            }

            Confirmation.setFormId = function(formId) {
                _obj.formId = formId;
            };

            Confirmation.getFormId = function() {
                return _obj.formId;
            };

            Confirmation.setFormName = function(name) {
                _obj.formName= name;
            };

            Confirmation.getFormName = function() {
                return _obj.formName;
            };

            Confirmation.markDirtyFields = function() {

                var formId = Confirmation.getFormId();
                var formName = Confirmation.getFormName();
                var form = document.getElementById(formId);

                var scope = angular.element(form).scope();


                angular.forEach(scope[formName], function(value, key) {
                    if(key[0] == '$') return;
                    if(key == 'reset' || key == 'modified' || key == 'modifiedCount' || key == 'modifiedModels' || key =='modifiedChildFormsCount' || key == 'modifiedChildForms') return;

                    // check whether input is changed or picker dropdown is changed
                    if (value.modified || !form[key]) {

                        if (form[key]) {
                            if (form[key].classList) {
                                if (form[key].classList.contains('btn')) {
                                    // color button
                                    form[key].parentElement.className += ' color-button-changed';
                                }
                                else {
                                    // input text box
                                    form[key].className +=' show-changed';
                                }
                            }

                        }
                        else {

                            // other controls
                            var ele = document.getElementById(key);
                            if (ele) {

                                if (ele.classList.contains('toggle-switch') && ele.classList.contains('ng-dirty')) {
                                    // it is toggle switch: update border color
                                    ele.className += ' toggle-switch-changed';
                                }
                                else if (value.modified) {
                                    // it is picker directive
                                    var pickers = ele.querySelectorAll('ol:not(.ng-hide)');

                                    if (pickers && pickers.length > 0 ) {
                                        ele.className +=' show-changed';
                                    }
                                }

                            }

                        }

                    }

                });
            };

            // remove the background color
            Confirmation.resetFieldsStyle = function() {

                var formId = Confirmation.getFormId();
                var formName = Confirmation.getFormName();
                var form = document.getElementById(formId);

                var scope = angular.element(form).scope();

                angular.forEach(scope[formName], function(value, key) {
                    if(key[0] == '$') return;
                    if(key == 'reset' || key == 'modified' || key == 'modifiedCount' || key == 'modifiedModels' || key =='modifiedChildFormsCount' || key == 'modifiedChildForms') return;

                    // check whether input is changed or picker dropdown is changed
                    if (value.modified || !form[key]) {

                        if (form[key]) {

                            if (form[key].classList) {
                                if (form[key].classList.contains('btn')) {
                                    // color button
                                    angular.element(form[key].parentElement).removeClass("color-button-changed");

                                }
                                else {
                                    // input text box
                                    angular.element(form[key]).removeClass("show-changed");
                                    form[key].focus();
                                }
                            }
                        }
                        else {
                            // other controls.
                            var ele = document.getElementById(key);
                            if (ele) {

                                if (ele.classList.contains('toggle-switch')) {
                                    // it is toggle switch: update border color
                                    //ele.style='';
                                    angular.element(ele).removeClass("toggle-switch-changed");
                                    ele.focus();
                                }
                                else if (value.modified) {
                                    // it is picker directive
                                    var pickers = ele.querySelectorAll('ol:not(.ng-hide)');

                                    if (pickers && pickers.length > 0) {
                                        //pickers[0].getElementsByTagName('button')[0].style='';
                                        angular.element(ele).removeClass("show-changed");
                                        ele.focus();

                                    }
                                }

                            }


                        }

                    }


                });
                scope[formName].$setPristine(); // this code is using angular defulat ng-default

            };

            // reset the state when form is dismissed
            Confirmation.dismissForm = function() {
                var form = document.getElementById(Confirmation.getFormName());
                var formScope = angular.element(form).scope();
                formScope[Confirmation.getFormId()].$setPristine();
            };

            return Confirmation;


        });
}());
