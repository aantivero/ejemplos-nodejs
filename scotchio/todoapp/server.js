/**
 * Created by Alejandro Antivero on 31/08/2014.
 * Vamos con configurar la aplicacion para utilizar express.
 */

var express = require('express');
var app = express(); //crear la aplicacion con express
var mongoose = require('mongoose'); //utilizar mongoose para el manejo de MongoDB
var morgan = require('morgan'); //logear las peticiones por consola
var bodyParser = require('body-parser');//hace pull de informacion desde HTML POST
var methodOverride = require('method-override');//simular delete y put

mongoose.connect('mongodb://localhost/test-app-todo');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

