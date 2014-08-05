var http = require('http');
var form = require('fs').readFileSync('form.html');
//convertir el row data en un object con el metodo parse
var querystring = require('querystring');
var util = require('util');

http.createServer(function (request, response) {
   if (request.method === 'GET') {
       response.writeHead(200, {'Content-type':'text/html'});
       response.end(form);
   } 
   if (request.method === 'POST') {
       var postData = '';
       request.on('data', function (chunk) {
           postData += chunk;
       }).on('end', function () {
          var postDataObject = querystring.parse(postData);
          console.log('Los datos recibidos son : '+postData);
          response.end('Datos recibidos:\n' + util.inspect(postDataObject));
       });
   }
}).listen(8080);

console.log('Servidor para procesar post data');
