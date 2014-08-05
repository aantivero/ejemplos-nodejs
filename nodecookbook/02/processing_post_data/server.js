var http = require('http');
var form = require('fs').readFileSync('form.html');
//convertir el row data en un object con el metodo parse
var querystring = require('querystring');
var util = require('util');
//agregamos un maximo del tamanio que se puede enviar por post
var maxData = 2 * 1024 * 1024;//2mb

http.createServer(function (request, response) {
   if (request.method === 'GET') {
       response.writeHead(200, {'Content-type':'text/html'});
       response.end(form);
   } 
   if (request.method === 'POST') {
       var postData = '';
       request.on('data', function (chunk) {
           postData += chunk;
           if (postData.length > maxData) {
               postData = '';
               this.destroy();//prevenimos que el usuario no mande mas data
               response.writeHead(413);//request entity too large
               response.end('Demasiado largo');
           }
       }).on('end', function () {
           if (!postData) { 
               //prevencion frente a un postdata vacio
               response.end();
               return;
           }
           var postDataObject = querystring.parse(postData);
           console.log('Los datos recibidos son : '+postData);
           response.end('Datos recibidos:\n' + util.inspect(postDataObject));
       });
   }
}).listen(8080);

console.log('Servidor para procesar post data');
