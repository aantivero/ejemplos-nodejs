/* 
 * Server - Main de la aplicacion.
 */
//llamando a la libreria express
var express = require('express');
//inicializando la aplicacion
var app = express();
var bodyParser = require('body-parser');
//mongoose para coneccion a mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
//verificar que la coneccion funciona
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'error en la coneccion db'));
db.on('open', function callback(){
   console.log('la coneccion esta abierta'); 
});

//vamos a importar la tarea del modelo
var Tarea = require('./app/models/tarea');

//configurar la aplicacion para utilizar body-parser()
//esto nos va a permitir obtener los datos de un POST
app.use(bodyParser.urlencoded({extended: true}));//parsea application/x-www-form-urlencoded
app.use(bodyParser.json());//parsea application/json

//setup port
var port = process.env.PORT || 8080;

/*
 * Router para nuestra API
 */
var router = express.Router(); //obtener una instancia de express Router

//primer router para poder testear nuestra api GET http://localhost:8080/api
router.get('/', function(req, res){
   res.json({message: 'Bienvenido al api RESTful con Node.js'}); 
});
//mas api aqui

//registrar el router en nuestro server
app.use('/api', router);

//inicializar el server
app.listen(port);
console.log('Servidor API RESTful ejecutando en el puerto ' + port);