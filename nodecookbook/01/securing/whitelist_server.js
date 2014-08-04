//La idea es poner una lista de contenidos permitidos, una white list
//
var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

//utilizar la '\' en window y las '/' en unix
var whitelist = [ 
  '\\index.html',
  '\\subcontent\\styles.css',
  '\\subcontent\\script.js'
];

http.createServer(function (request, response) {
  var lookup = url.parse(decodeURI(request.url)).pathname;
  lookup = path.normalize(lookup);
  console.log('lookup: ' + lookup);
  lookup = (lookup === '/') ? '/index.html' : lookup;
  if (whitelist.indexOf(lookup) === -1) {
    console.log('la solicitud ' + lookup + ' no esta en el whitelist');
    response.writeHead(404, {'Content-Type': 'text/html'});
	response.end('<h4>No se encuentra la P&aacute;gina solicitada</h4>');
	return;
  }
  var f = 'content' + lookup;
  console.log('leer archivo ' + f);
  fs.exists(f, function (exists) {
    if (!exists) {
	  console.log('el archivo no existe');
	  response.writeHead(404, {'Content-Type': 'text/html'});
	  response.end('<h4>No se encuentra la p&aacute;gina. Ingrese otro path</h4>');
	  return;
	}
	
	fs.readFile(f, function (err, data) {
      response.end(data);
	});
  });
}).listen(8080);
console.log('Iniciando el servidor con pathname incluido en el puerto 8080');