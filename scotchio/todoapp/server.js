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
var port = process.env.PORT || 8080;//puerto

mongoose.connect('mongodb://localhost/test-app-todo');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));//parsear application/x-www-form-urlencoded
app.use(bodyParser.json()); //parsear application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); //parsear application/vnd.api+json como json
app.use(methodOverride);

//definir el modelo de datos
var Tarea = mongoose.model('Tarea',{
   descripcion: String 
});

//definir las rutas del api
//-----------routes
app.get('/api/tareas', function(req, res){
    Tarea.find(function(err, tareas){
       if(err){
           res.send(err);
       } 
       res.json(tareas);
    });
});
app.post('/api/tareas', function(req, res){
   Tarea.create({
       descripcion: req.body.descripcion
   }, function(err, tarea){
       if(err){
           res.send(err);
       }
       Tarea.find(function(err, tareas){
           if(err){
               res.send(err);
           }
           res.json(tareas);
       });
   }); 
});
app.delete('/api/tareas/:tarea_id', function(req, res){
   Tarea.remove({
       _id: req.params.tarea_id
   }, function(err, tarea){
      if(err){
          res.send(err);
      }
      Tarea.find(function(err, tareas){
         if(err){
             res.send(err);
         } 
         res.json(tareas);
      });
   });
});

//ruta del frontend
app.get('*', function(req, res){
   res.sendfile('.public/index.html'); 
});

//ejecutar y escuchar el server en el puerto 8080
app.listen(port);
console.log('La aplicación esta ejecutando en el puerto ' + port);
