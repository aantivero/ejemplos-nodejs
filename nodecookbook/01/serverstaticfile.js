/**
 * Created by alex on 02/08/2014.
 */
var http = require('http');
var path = require('path');
var fs = require('fs');

//mapa con los content-type header
var mimeTypes = {
    '.js' : 'text/javascript',
    '.css' : 'text/css',
    '.html' : 'text/html'
};

http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function (exists) {
       console.log(exists ? lookup + " is there." : lookup + " doesn't exist.");
    });
}).listen(8080);