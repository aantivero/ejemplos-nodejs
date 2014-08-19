/* 
 * servidor http client en node.js
 * funciona por linea de comando
 */
var http = require('http');
var urlOpts = {
    host: 'www.nodejs.org',
    path: '/',
    port: 80
};
http.get(urlOpts, function (response) {
   response.on('data', function (chunk) {
       console.log(chunk.toString());
   }); 
});

