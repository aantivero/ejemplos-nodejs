/* 
 * Este server hace un get donde se puede pasar por parametro la url 
 */
var http = require('http');
var url = require('url');
var urlOpts = {
  host: 'www.nodejs.org',
  path: '/',
  port: '80'
};
//el argumento pasado por comando 'node fetch2 www.google.com'
if (process.argv[2]) {
    if (!process.argv[2].match('http://')) {
        process.argv[2] = 'http://' + process.argv[2];
    }
    urlOpts = url.parse(process.argv[2]);
}

http.get(urlOpts, function (response) {
   response.on('data', function (chunk) {
      console.log(chunk.toString()); 
   });
}).on('error', function(e){
    console.log('Error : ' + e.message);
});

