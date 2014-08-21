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

//middleware para todos los Routes
router.use(function(req, res, next){
   //logear la llamada al middleware
   console.log(req.method, req.url);
   //continuar
   next();
});

//primer router para poder testear nuestra api GET http://localhost:8080/api
router.get('/', function(req, res){
   res.json({message: 'Bienvenido al api RESTful con Node.js'}); 
});
//mas api aqui
/**
 * vamos a expresar las rutas 
 * /api/tareas GET obtener todas las tareas
 * /api/tareas POST crear una nueva tarea
 * /api/tareas/:tarea_id GET obtener una tarea
 * /api/tareas/:tarea_id PUT modificar una tarea 
 * /api/tareas/:tarea_id DELETE borrar una tarea
 */
router.route('/tareas')
    //crear una tarea
    .post(function(req, res){
        var tarea = new Tarea();
        tarea.titulo = req.body.titulo;
        tarea.author = req.body.author;
        tarea.descripcion = req.body.descripcion;
        tarea.save(function(err){
           if (err) 
               res.send(err);
           res.json({message: 'La tarea ' + tarea.titulo + ' fue creada.'});
        });
    })
    //obtener todas las tareas
    .get(function(req, res){
        Tarea.find(function(err, tareas){
           if(err)
               res.send(err);
           res.json(tareas);
        });
    });
//tarea por parametro
router.route('/tareas/:tarea_id')
    //devolver la tarea por id
    .get(function(req, res){
        Tarea.findById(req.params.tarea_id, function(err, tarea){
           if(err)
               res.send(err);
           if(!tarea)
               res.json({message: 'La Tarea no se encuentra.'});
           res.json(tarea);
        });
    })
    //actualizar la informacion de una tarea
    .put(function(req, res){
        //primero buscamos la tarea que modificamos
        Tarea.findById(req.params.tarea_id, function(err, tarea){
           if(err)
               res.send(err);
           tarea.titulo = req.body.titulo;
           tarea.author = req.body.author;
           tarea.descripcion = req.body.descripcion;
           tarea.fecha = Date.now();
           tarea.save(function(err){
              if(err)
                  res.send(err);
              res.json({message: 'La tarea fue actualizada '});
           });
        });
    })
    //eliminar una tarea por id
    .delete(function(req, res){
        Tarea.remove({
            _id: req.params.tarea_id
        }, function(err, tarea){
           if(err) 
               res.send(err);
           res.json({message: 'La tarea fue eliminada'});
        });
    });
//registrar el router en nuestro server
app.use('/api', router);

//inicializar el server
app.listen(port);
console.log('Servidor API RESTful ejecutando en el puerto ' + port);