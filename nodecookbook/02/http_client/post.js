/**
 * Created by alex on 18/08/2014.
 * Envìa post request al server
 * Para probar este servicio usar el server.js de processing_post_data
 * Y ejecutar por ejemplo node post.js "foo=bar&person=Alex&age=36"
 */
var http = require('http');
var urlOpts = {
    host: 'localhost',
    path: '/',
    port: '8080',
    method: 'POST'
  };
var request = http.request(urlOpts, function (response) {
    response.on('data', function (chunk){
        console.log(chunk);
    });
}).on('error', function (e) {
   console.log('error: ' + e.stack);
});
process.argv.forEach(function (postItem, index) {
   if (index > 1) {
    console.log(index + '--' + postItem);
    request.write(postItem + '\n');
   }
});
request.end();