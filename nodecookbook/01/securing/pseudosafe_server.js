var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer( function (request, response) {
  var lookup = url.parse(decodeURI(request.url)).pathname;
  lookup = (lookup === "/") ? '/index.html-serve' : lookup + '-serve';
  var f = 'content-pseudosafe' + lookup;
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

console.log('Iniciando servidor con pseudo seguridad');