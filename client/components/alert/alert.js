(function () {
    'use strict';

    angular.module('lcma')
      .config(function (toastrConfig) {
        // Toaster main config
        angular.extend(toastrConfig, {
          autoDismiss: true,
          containerId: 'toast-container',
          maxOpened: 0,
          newestOnTop: true,
          positionClass: 'toast-bottom-right',
          preventDuplicates: false,
          preventOpenDuplicates: false,
          target: 'body'
        });
      })
        .provider('$lcmAlert', function () {


            this.$get = function (toastr) {

                function show(type, content) {
                    return toastr[type](content);
                }

                function close(){
                  toastr.clear();
                }

                function error(content){
                    show('error', content);
                }

                function info(content){
                    show('info', content);
                }

                function success(content){
                    show('success', content);
                }

                function warning(content){
                    show('warning', content);
                }

                return {
                    close: close,
                    error: error,
                    info: info,
                    success: success,
                    warning: warning
                };
            };
        }
    );
}());
