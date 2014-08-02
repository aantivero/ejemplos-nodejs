/**
 * Created by alex on 02/08/2014.
 */
var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
    '.js' : 'text/javascript',
    '.html' : 'text/html',
    '.css' : 'text/css'
};

//manejo del cache
var cache = {};
console.log("pasa a");

function cacheAndDeliver(f, cb) {
    if (!cache[f]) {
        fs.readFile(f, function (err, data) {
           if (!err) {
               cache[f] = {content: data};
           }
           cb(err, data);
        });
        return;
    }
    console.log('cargando ' + f + ' del cache');
    cb(null, cache[f].content);
}

console.log("pasa b");

http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function (exists) {
        if (exists) {
            //reemplazo fs.readFile por la nueva funcion que maneja el cache
            cacheAndDeliver(f, function (err, data) {
                if (err) {
                    response.writeHead(500);
                    response.end('Error en el servidor!!!');
                    return;
                }
                var headers = {'Content-Type' : mimeTypes[path.extname(lookup)]};
                response.writeHead(200, headers);
                response.end(data);
            });
            return;
        }
        response.writeHead(404);//no se encontro el archivo
        response.end('No se encuentra la pagina');
    });
}).listen(8080);

console.log("Iniciando el servidor");