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

http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function (exists) {
        if (exists) {
            var headers = {'Content-type' : mimeTypes[path.extname(f)]};
            if (cache[f]) {
                console.log('desde el cache ' + f);
                response.writeHead(200, headers);
                response.end(cache[f].content);
                return;
            }
            //stream
            var s = fs.createReadStream(f).once('open', function () {
               //listener
                console.log('leer readstream');
                response.writeHead(200, headers);
                this.pipe(response);
            }).once('error', function (e) {
                //error handler
                console.log('Ocurrio un error en el readStream. ' + e);
                response.writeHead(500);
                response.end('Ocurrio un error en el servidor');
            });
            fs.stat(f, function (err, stats) {
                var bufferOffset = 0;
                cache[f] = {content: new Buffer(stats.size)};
                s.on('data', function (chunk) {
                    chunk.copy(cache[f].content, bufferOffset);
                    bufferOffset += chunk.length;
                });
            });
            return;
        }
        response.writeHead(404);//no se encontro el archivo
        response.end('No se encuentra la pagina');
    });
}).listen(8080);

console.log("Iniciando el servidor");