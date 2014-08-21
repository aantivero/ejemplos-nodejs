/**
 * Created by Alejandro Antivero on 21/08/2014.
 * Este es el handler de las API Routes
 */
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
    //route para manejar el borrado (app.delete)

    // routes de frontend
    //route para atender todos los request de angular
    app.get('*', function(req, res) {
        //cargar el public/index.html
        res.sendfile('./public/views/index.html');
    });
}