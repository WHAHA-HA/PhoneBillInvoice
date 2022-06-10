var http = require("http");
var config = require('../../config/environment');
var baseUrl = config.logi.host,
  publicHost = config.logi.publicHost,
  port = config.logi.port,
  scriptBase = config.logi.scriptBase,
  username = config.logi.username;

exports.load = function (id, ip, cb) {


  var url = [
    "/Logi/rdTemplate/rdGetSecureKey.aspx?Username=",
    username,
    "&ClientBrowserAddress=",
    ip
  ]
    .join('');

  var options = {
    hostname: baseUrl,
    port: port,
    path: url,
    method: 'GET'
  };

  var req = http.request(options, function (res) {
    var body = '';


    res.on("data", function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      cb(null, body);
    });
  });

  req.end();

  req.on('error', function (e) {
    cb(e, null);
  });

};

exports.getEmbedCode = function (chunk, reportId) {

    var logiAppUrl = 'http://' + baseUrl + '/Logi/';
    var publicLogiAppUrl = 'http://' + publicHost + '/Logi/';
    if (reportId.indexOf('=') != (reportId.length - 1)) {
        var rdSecure = "'rdSecurekey':'"+chunk+"'";
        var t = reportId.split("&")[0];
        var p = reportId.split("&")[1];
        if (p == null) {
            p = "";
        } else {
            rdSecure += "," + p;
        }
        return "<div id=\"divNd\"  style=\"width:100%; height:100%;\" data-autoSizing=\"all\" data-applicationUrl=\"" + publicLogiAppUrl +
                "\" data-report=\"" + t + "\" data-linkParams=\"{"+ rdSecure + "}\" > </div> <script src=\"" + scriptBase + "rdTemplate/rdEmbedApi/rdEmbed.js\" type=\"text/Javascript\"></script>";
    }


};


/*
 * resM.send("<p style=\"font-size:20px;text-align:center;\" >
 *     This is a node page </p> <div id=\"divNd\" data-autoSizing=\"all\" data-applicationUrl=\"" + LogiAppURL + "\"
 *     data-report=\"TestCJC\" data-linkParams=\"{'rdSecurekey' : '" + MessageBack + "'}\" > </div> <script src=\"" + LogiAppURL + "rdTemplate/rdEmbedApi/rdEmbed.js\" type=\"text/Javascript\"></script>");
 * */
