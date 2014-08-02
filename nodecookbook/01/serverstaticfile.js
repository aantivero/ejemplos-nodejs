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
    if (request.url === '/favicon.ico') {
        console.log('No se encuentra ' + f);
        response.end();
        return;
    }
    fs.exists(f, function (exists) {
       if (exists) {
           fs.readFile(f, function (err, data) {
               if (err) {
                   response.writeHead(500);
                   response.end("Error en el servidor!");
                   return;
               }
               var headers = {'Content-Type' : mimeTypes[path.extname(lookup)]};
               response.writeHead(200, headers);
               response.end(data);
           });
           return;
       }
       response.writeHead(404); //no encuentra el archivo
       response.end("No se encuentra el archivo");
    });
}).listen(8080);
console.log("Iniciado el servidor de archivos estaticos.")