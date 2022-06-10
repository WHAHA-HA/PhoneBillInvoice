(function () {
    'use strict';

    angular.module('lcma')
            .factory('ThemeSchema', function (DS) {

                return {
                    "data": [
                        {
                            "id": "id1",
                            "label": "Menu Background:",
                            "color": "#0B1B2E",
                            "class": ".app-layout .app-sidebar .panel-heading, .app-layout .app-sidebar",
                            "property": "background-color"
                        },
                        {
                            "id": "id2",
                            label: "Submenu Background:",
                            color: "#102743",
                            "class": " .app-sidebar header, .app-layout .app-sidebar .panel-group .panel-heading + .panel-collapse .panel-body, .app-sidebar .app-nav .nav > li > a:hover ,.app-sidebar .app-nav .nav > li.hover ul",
                            "property": "background-color"
                        },
                         {
                            "id": "id3",
                            label: "Menu Text:",
                            color: "#f9f9f9",
                            "class": ".app-layout .app-sidebar .panel-heading a, .app-layout .app-sidebar .panel-heading a:link, .app-layout .app-sidebar .panel-heading a:visited, .app-layout .app-sidebar .panel-heading a:hover, .app-layout .app-sidebar .panel-heading a:active, .app-layout .app-sidebar .panel-heading a:focus",
                            "property": "color"
                        },
                        {
                            "id": "id4",
                            label: "Submenu Text:",
                            color: "#f9f9f9",
                            "class": ".app-layout .app-sidebar .app-nav .nav > li > a, .app-layout .app-sidebar .app-nav .nav > li > a:hover, .app-layout .app-sidebar .app-nav .nav > li.active > a",
                            "property": "color"
                        },
                        {
                            "id": "id5",
                            "label": "Title Background:",
                            "color": "#1a3f6d",
                            "class": ".panel .panel-heading",
                            "property": "background-color"
                        },
                          {
                            "id": "id6",
                            "label": "Title Text:",
                            "color": "#f9f9f9",
                            "class": ".panel .panel-heading h2",
                            "property": "color"
                        },
                        {
                            "id": "id7",
                            "label": "Modal Background:",
                            "color": "#fff",
                            "class": ".modal-content",
                            "property": "background-color"
                        },
                        {
                            "id": "id8",
                            "label": "Save Button:",
                            "color": "#286090",
                            "class": ".btn-primary",
                            "property": "background-color"
                        },
                        {
                            "id": "id9",
                            "label": "Save Button Border:",
                            "color": "#2e6da4",
                            "class": ".btn-primary",
                            "property": "border-color"
                        },
                        {
                            "id": "id10",
                            "label": "Default Button Color:",
                            "color": "#e1e1e1",
                            "class": ".btn-default",
                            "property": "background-color"
                        },
                        {
                            "id": "id11",
                            "label": "Header Background:",
                            "color": "#FFFFFF",
                            "class": ".app-layout .app-topbar",
                            "property": "background-color"
                        },
                        /*{
                            "id": "id12",
                            "label": "Login Background:",
                            "color": "#0B1B2E",
                            "class": ".login-body",
                            "property": "background-color"
                        }*/
                    ]
                };
            });

}());
