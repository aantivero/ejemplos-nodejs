/**
 * Created by alex on 18/08/2014.
 * Este es un cliente http para hacer upload de archivos
 * Utilizando el server.js de handling_file_uploads (crear el directorio uploads)
 * Usamos el Content-type = multipart/form-data para hacerle entender al server que enviamos archivos
 * se ejcuta como node upload.js archivo1 archivo2 archivon
 *
 */
var http = require('http');
var fs = require('fs');
var urlOpts = {
    host: 'localhost',
    path: '/',
    port: '8080',
    method: 'POST'
  };
var boundary = Date.now();
urlOpts.headers = {
    'Content-type': 'multipart/form-data; boundary="' + boundary + '"'
};
boundary = "--" + boundary;
var request = http.request(urlOpts, function (response) {
    response.on('data', function (chunk) {
        console.log(chunk.toString());
    });
}).on('error', function (e) {
   console.log('error : ' + e.stack);
});
//funcion recursiva
(function multipartAssembler(files) {
    var progress = 0;
    var f = files.shift();
    var fSize = fs.statSync(f).size;
    fs.createReadStream(f).once('open', function () {
        request.write(boundary + '\r\n' +
        'Content-Disposition: ' +
        'form-data; name="userfile"; filename="' + f + '"\r\n' +
        'Content-Type: application/octet-stream\r\n' +
        'Content-Transfer-Encoding: binary\r\n\r\n');
    }).on('data', function (chunk) {
        request.write(chunk);
        progress += chunk.length;
        console.log(f + ': ' + Math.random((progress / fSize) * 10000)/100 + '%');
    }).on('end', function () {
        if (files.length) {
            multipartAssembler(files);
            return;//early finish
        }
        request.end('\r\n' + boundary + '--\r\n\r\n\r\n');
    });
}(process.argv.splice(2, process.argv.length)));
//con el splice se eliminan los 2 primeros parametros del argumento