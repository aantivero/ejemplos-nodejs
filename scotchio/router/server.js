/**
 * Created by alejandro.antivero on 20/08/2014.
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

//Routes
//una ruta simple
app.get('/sample', function(req, res){
   res.send('este es un ejemplo');
});
//proximo routes aqui

app.listen(port);
console.log('La aplicación esta corriendo en el puerto ' + port);