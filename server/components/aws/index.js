// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var appConfig = require("../../../config.json");

module.exports = function (config) {
  var cfg = appConfig.aws;
  AWS.config.update({region: cfg.defaultRegion, accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey});

  return {
    uploadFile: function (settings, cb) {
      var file = settings.file,
        key = settings.key,
        folder = settings.folder;

      console.log("Upload to S3 using config", cfg);
      console.log("Upload file", file);

      // Read in the file, convert it to base64, store to S3
      var fileStream = fs.createReadStream(file.path);
      fileStream.on('error', function (err) {
        cb(err, null);
      });
      fileStream.on('open', function () {
        var s3 = new AWS.S3();
        s3.putObject({
          Bucket: cfg.defaultBucket,
          Key: folder + "/" + key,
          Body: fileStream
        }, function (err, data) {
          cb(err, data);
        })
      });
    },
    downloadFile: function (settings, cb) {
      var key = settings.key,
        folder = settings.folder;

      var s3 = new AWS.S3();

      console.log('Download file call', settings);


      return s3.getObject({
        Bucket: cfg.defaultBucket,
        Key: folder + "/" + key
      });

    }
  }
};
