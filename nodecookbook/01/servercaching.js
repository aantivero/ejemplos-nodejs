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
    //esto me dice en que estado esta el archivo, si fue modificado, etc
    /* atime ultimo acceso, mtime ultima modificacion, ctime ultimo cambio
     * mtime registra alteraciones en el contenido del archivo y ctime alteraciones del archivo.
     * si cambio permisos del archivo se modifica ctime pero mtime queda igual
     */
    fs.stat(f, function (err, stats) {
        if (err) { console.log('Hubo un error!!!', err); }
        //para que funcione en windows hay que usar mtime en lugar de ctime
        var lastChanged = Date.parse(stats.mtime);
        var isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
        if (!cache[f] || isUpdated) {
            fs.readFile(f, function (err, data) {
                console.log('Leyendo archivo ' + f);
                if (!err) {
                    cache[f] = {content: data, timestamp: Date.now()};
                }
                cb(err, data);
            });
            return;
        }
        console.log('cargando ' + f + ' del cache');
        cb(null, cache[f].content);
    });
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