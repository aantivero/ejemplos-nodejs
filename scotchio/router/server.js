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

//obtener una instancia de Router
var router = express.Router();
/**
 * Middleware es la forma de hacer algo antes que el request se procese
 * por ejemplo chequeo de autenticacion, logeo de datos para analisis o cualquier otra cosa
 * lo que vamos a hacer es logear siempre que llegue un request solo para el objeto router
 */
router.use(function(req, res, next){
   //logear cada request por la consola
    console.log(req.method, req.url);
    //continuar con lo que debe hacer
    next();
});
//home
router.get('/', function (req, res){
   res.send('Esta es la pagina de inicio');
});
//about
router.get('/about', function(req, res){
   res.send('Esta es la pagina sobre nosotros');
});
app.use('/', router);
//la anterior puede cambiar por ejemplo app.use('/app', router) -> localhost:8080/app/about o localhost:8080/app/
//de esta manera podemos crear varios routes

app.listen(port);
console.log('La aplicación esta corriendo en el puerto ' + port);