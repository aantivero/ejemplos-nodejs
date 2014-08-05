/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var connect = require('connect');
var bodyParser = require('body-parser');
var util = require('util');
var form = require('fs').readFileSync('form.html');

connect(connect.limit('2mb'), bodyParser(), function (request, response){
   if (request.method === 'POST') {
       console.log('Datos del POST: ', request.body);
       response.end('Datos ingresados :\n' + util.inspect(request.body));
   } 
   if (request.method === 'GET') {
       response.writeHead(200, {'Content-type': 'text/html'});
       response.end(form);
   }
}).listen(8080);
console.log('Usando el middleware connect y body parser');
