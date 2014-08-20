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
/**
 * podemos agregar una validacion en el middleware para comprobar el campo :nombre
 * En el caso de crear un api rest podemos validar un token por ejemplo
 */
router.param('nombre', function(req, res, next, nombre){
   //hacer una validacion del campo nombre aca
    console.log('ejecutando alguna validacion con el campo nombre ' + nombre);
    //cuando la validacion esta ok se guarda el item en el request
    req.nombre = nombre + ' zaraza ';
    //ejecutar el proximo
    next();
});
/**
 * Router con parametros localhost:8080/hola/:nombre
 */
router.get('/hola/:nombre', function(req, res){
    //con el middleware param se lo toma sin params
    res.send('Hola ' + req.nombre + '!');
});
app.use('/', router);
//la anterior puede cambiar por ejemplo app.use('/app', router) -> localhost:8080/app/about o localhost:8080/app/
//de esta manera podemos crear varios routes

app.listen(port);
console.log('La aplicación esta corriendo en el puerto ' + port);