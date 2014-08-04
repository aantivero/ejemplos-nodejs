var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

http.createServer(function (request, response) {
  var lookup = url.parse(decodeURI(request.url)).pathname;
  lookup = path.normalize(lookup);
  console.log('lookup: ' + lookup);
  lookup = (lookup === '/') ? '/index.html' : lookup;
  var f = 'content' + lookup;
  console.log('leer archivo ' + f);
  fs.exists(f, function (exists) {
    if (!exists) {
	  console.log('el archivo no existe');
	  response.writeHead(404);
	  response.end('No se encuentra la p&aacute;gina');
	  return;
	}
	
	fs.readFile(f, function (err, data) {
      response.end(data);
	});
  });
}).listen(8080);
console.log('Iniciando el servidor con pathname incluido en el puerto 8080');