'use strict';

angular.module('lcma')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $timeout, $lcmaRole) {

    $scope.onMouseEnter = function () {
      angular.element('body').addClass('sidebar-hover'); 
    };
    
    $scope.accordionArray= [];

    $scope.onMouseLeave = function () {
      angular.element('body').removeClass('sidebar-hover');
      if($rootScope.$layout.minimized){
          $scope.accordionArray= [];
      }
    };
    
    $rootScope.$watch('$layout.minimized',function(){
        $scope.accordionArray= [];
    });

    $timeout(function () {
      var menu = [
        {
          "name": "Admin",
          "url": "/admin",
          "icon": "fa fa-th-large",
          submenu: [
            {
              "name": "Users",
              "url": "/users"
            },
            {
              "name": "Roles",
              "url": "/roles"
            },
            {
              "name": "Permissions",
              "url": "/permissions"
            },
            {
              "name": "Content Filters",
              "url": "/content-filters"
            },
            {
              "name": "Accounts",
              "url": "/accounts_admin"
            },
            {
              "name": "Dictionary",
              "url": "/dictionary"
            }
          ]
        },
        {
          "name": "Ordering",
          "url": "/#!/",
          "icon": "fa fa-calendar-check-o",
          "submenu": [
            {
              "name": "Order List",
              "url": "/orders"
            },
            {
              "name": "Project List",
              "url": "/projects"
            }
          ]
        },
        {
          "name": "Inventory",
          "url": "/#!/",
          "icon": "fa fa-tags",
          "submenu": [
            {
              "name": "Inventory List",
              "url": "/inventories"
            },
            {
              "name": "Recon Grids",
              "url": "/recon"
            }
          ]
        },
        {
          "name": "Cost Analysis",
          "url": "/invoices",
          "icon": "fa fa-file-o",
          "submenu": [
            {
              "name": "Accounts",
              "url": "/accounts",
              "badge": $rootScope.$stat.accounts
            },
            {
              "name": "Invoices",
              "badge": $rootScope.$stat.invoices,
              "url": "/invoices"
            },
            {
              "name": "Disputes",
              "url": "/disputes",
              "badge": $rootScope.$stat.disputes
            },
            {
              "name": "Audit List",
              "url": "/audits"
            },
            {
              "name": "Audit Rates",
              "url": "/audit_rate"
            },
            {
              "name": "Charge Browser",
              "url": "/charge_browser"
            },
            {
              "name": "Invoice Validation",
              "url": "/#!/"
            },
            {
              "name": "GL Codes",
              "url": "/glcode"
            },
            {
              "name": "GL Strings",
              "url": "/glstrings"
            },
	    {
              "name": "GL Rule Builder",
              "url": "/glrulebuilder"
            }
          ]
        },
        {
          "name": "Contracts",
          "url": "/#!/",
          "icon": "fa fa-cogs",
          "submenu": [
            {
              "name": "Contract List",
              "url": "/contracts"
            }
          ]
        },
        {
          "name": "Services / Work Mgmt",
          "url": "/#!/",
          "icon": "fa fa-cog",
          "submenu": [
            {
              "name": "Ticket List",
              "url": "/tickets"
            }
          ]
        },
        {
          "name": "Usage Mgmt",
          "url": "/#!/",
          "icon": "fa fa-phone",
          "submenu": [
            {
              "name": "Call Performance",
              "url": "/performance"
            },
            {
              "name": "Network Utilization",
              "url": "/utilization"
            }
          ]
        },
        {
          "name": "Reporting & Analysis",
          "url": "/reports",
          "icon": "fa fa-pie-chart",
          "submenu": [
            {
              "name": "My Reports",
              "url": "/reports"
            },
            {
              "name": "Report Gallery",
              "url": "/#!/"
            },
            {
              "name": "Dashboard Gallery",
              "url": "/#!/"
            }
          ]
        },
        {
          "name": "App Data",
          "url": "/#!/",
          "icon": "fa fa-university",
          "submenu": [
            {
              name: 'Building',
              url: '/buildings'
            },
            {
              "name": "Site",
              "url": "/sites"
            },
            {
              "name": "Equipment",
              "url": "/equipments"
            },
            {
              "name": "Employee",
              "url": "/employees"
            },
            {
              "name": "Vendor",
              "url": "/vendors"
            },
            {
              "name": "Contacts",
              "url": "/contacts"
            },
            {
              "name": "Customer",
              "url": "/customers"
            }
          ]
        },

      ];


      $scope.$on('$stateChangeSuccess', function (event, state) {
        $scope.activeUrl = $location.path();
      });

      $rootScope.$watch('$me', function (me) {
        if (me) {

          var visibleMenu = [];

          angular.forEach(menu, function (x) {

            if (x.roles && $lcmaRole.isInRole(me, x.roles)) {
              visibleMenu.push(x);
            }
            else if (!x.roles) {
              visibleMenu.push(x);
            }

          });

          $scope.menu = visibleMenu;

        }
      });

      $scope.isOpen = function (item) {
        //return item.url === $scope.activeUrl;
        return item.isOpen;
      };

      $scope.open = function (item) {
        //$scope.activeUrl = item.url;
        item.isOpen = !item.isOpen;

        if (!item.submenu) {
          $location.url(item.url);
        }
      };

    }, 300)
  });
