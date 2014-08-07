/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var http = require('http');
var form = require('fs').readFileSync('form.html');
var formidable = require('formidable');

http.createServer(function (request, response) {
   if (request.method === 'POST') {
       var incoming = new formidable.IncomingForm();
       incoming.uploadDir = 'uploads';
       incoming.on('fileBegin', function (field, file) {
            //esto preserva el nombre del archivo porque formidable genera un nombre aleatorio hexadecimal
           //hacemos un append del nombre original al final del random asignado por formidable
               if (file.name) {
                   file.path += "-" + file.name;
               }
           }).on('file', function (field, file) {
               if (!file.size) {
                   return;
               }
               response.write(file.name + ' recibido\n');
           }).on('field', function (field, value){
               //maneja entrada de un formulario no necesariamente archivos
               response.write(field + ' : ' + value + '\n');
           }).on('end', function () {
               response.end('Todos los archivos fueron recibidos');
           });

       incoming.parse(request);
   }
   if (request.method === 'GET') {
       response.writeHead(200, {'Content-type' : 'text/html'});
       response.end(form);
   }
}).listen(8080);

console.log('Iniciado el servidor con upload de archivos y datos en el puerto 8080');

