/**
 * Created by alex on 02/08/2014.
 */
var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Wohoo!!');
}).listen(8080);