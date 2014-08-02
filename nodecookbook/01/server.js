/**
 * Created by alex on 02/08/2014.
 */
var http = require('http');
var path = require('path');

//array con las rutas
var pages = [
    {route: '', output: 'Wow Nodejs'},
    {route: 'about', output: 'Otro ejemplo de enrutar con nodejs'},
    {route: 'another page', output: function () {
        return 'Here\'s' + this.route;
    }}];

http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url));
    //vamos a recorrer el array hasta encontrar el correspondiente, caso contrario un 404
    pages.forEach(function (page) {
        if (page.route === lookup) {
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.end(typeof page.output === 'function' ? page.output() : page.output);
        }
    });
    if (!response.finished) {
        response.writeHead(404);
        response.end('No se encuentra la pagina.');
    }
}).listen(8080);