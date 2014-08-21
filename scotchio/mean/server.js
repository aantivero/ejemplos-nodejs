/**
 * Created by Alejandro Antivero on 21/08/2014.
 */

//----modulos
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

//----configuracion

//----archivos de configuracion
var db = require('./config/db');

var port = process.env.PORT || 8080;
//mongoose.connect(db.url); //descomentar cuando ingresamos la coneccion

//logs
app.use(morgan('dev'));
//get all data/stuff del body (POST) parameters
app.use(bodyParser.json());//parsear application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));//parsear application/vndd.api+json como json
app.use(bodyParser.urlencoded({ extended: true}));//parse application/x-www-form-urlencoded

//sobreescribir con el metodo X-HTTP-Method-Override en el header del request para simular  DELETE y PUT
app.use(methodOverride('X-HTTP-Method-Override'));
//setear la localizacion de los archivos estaticos /public/img sera para el usuario /img
app.use(express.static(__dirname + '/public'));

//----configuracion de nuestras routes
require('./app/routes')(app);

//---start app
app.listen(port);
//exponer el app
exports = module.exports = app;