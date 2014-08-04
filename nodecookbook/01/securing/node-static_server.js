/* 
 * el proposito de este server es incluir todo lo visto en cuestión de seguridad
 * Provee una solucion al especificación standard RFC2616
 * 
 */

var static = require('node-static');
var fileServer = new static.Server('./content');

require('http').createServer(function (request, response) {
  request.addListener('end', function(){
    fileServer.serve(request, response, function(err, res) {
        if (err) {
            console.error("Error serving " + request.url + " - " + err.message);
            response.writeHead(err.status, err.headers);
            response.end();
        }
    });  
  }).resume(); 
}).listen(8080);

console.log('Inicializado el servidor node-static en el puerto 8080');
