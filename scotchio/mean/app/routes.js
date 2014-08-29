/**
 * Created by Alejandro Antivero on 21/08/2014.
 * Este es el handler de las API Routes
 */
var Tarea = require('./models/tarea');
module.exports = function(app){
    //server routes
    //maneja las llamadas a la api
    //autenticacion routes

    //ejemplo de api route
    app.get('/api/tareas', function(req, res){
        //usando mongoose para obtener todas las tareas
       Tarea.find(function(err, tareas){
           if (err) {
               res.send(err);
           }
           res.json(tareas);
       });
    });
    //route para manejar la creacion (app.post)
    app.post('/api/tareas', function(req, res){
       Tarea.create({
        titulo: req.body.titulo,
        author: req.body.author,
        descripcion: req.body.descripcion
       }, function(err, tarea){
          if (err) {
              res.send(err);
          }
          Tarea.find(function(err, tareas){
             if (err) {
                 res.send(err);
             }
             res.json(tareas);
          });
       });
    });
    //route para manejar el borrado (app.delete)
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

    app.get('/api/nerds', function(req, res){
       Nerd.find(function(err, nerds){
          if (err) {
              res.send(err);
          }
          res.json(nerds);
       });
    });

    // routes de frontend
    //route para atender todos los request de angular
    app.get('*', function(req, res) {
        //cargar el public/index.html
        res.sendfile('./public/index.html');
    });
}