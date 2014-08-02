/**
 * Created by alex on 02/08/2014.
 */
var http = require('http');
var url = require('url');

//array con las rutas
var pages = [
    {id: '1', route: '/', output: 'Wow Nodejs'},
    {id: '2', route: '/about', output: 'Otro ejemplo de enrutar con nodejs'},
    {id: '3', route: '/about/node', output: 'fullstack I/O basado en V8'},
    {id: '4', route: '/about/this', output: 'enrutamiento multilevel nodejs'},
    {id: '5', route: '/another page', output: function () {
        return 'Here\'s' + this.route;
    }}];

http.createServer(function (request, response) {
    //var lookup = decodeURI(request.url);
    var id = url.parse(decodeURI(request.url), true).query.id;
    //vamos a recorrer el array hasta encontrar el correspondiente, caso contrario un 404
    if (id) {
        pages.forEach(function (page) {
            if (page.id === id) {
                response.writeHead(200, {'Content-Type' : 'text/html'});
                response.end(typeof page.output === 'function' ? page.output() : page.output);
            }
        });
    }
    if (!response.finished) {
        response.writeHead(404);
        response.end('No se encuentra la pagina.');
    }
}).listen(8080);