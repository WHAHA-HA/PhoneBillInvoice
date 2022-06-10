
(function () {
  'use strict';

  angular.module('lcma')
    .factory('Vendor', function (DS) {

      var Vendor = DS.defineResource({
        name: 'vendor',

      });

      // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
      Vendor.resizedataURL = function (datas, callback) {
        // We create an image to receive the Data URI
        var wantedWidth = 100;
        var wantedHeight = 100;
        var img = document.createElement('img');

        // When the event "onload" is triggered we can resize the image.
        img.onload = function()
        {
          // We create a canvas and get its context.
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');

          // We set the dimensions at the wanted size.
          canvas.width = wantedWidth;
          canvas.height = wantedHeight;

          // We resize the image with the canvas method drawImage();
          ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

          datas = canvas.toDataURL();

          /////////////////////////////////////////
          // Use and treat your Data URI here !! //
          /////////////////////////////////////////
          callback(datas);
        };
        img.src = datas;
      };

      return Vendor;
    });
}());
