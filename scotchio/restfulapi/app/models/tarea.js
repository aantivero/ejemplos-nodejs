/* 
 * Esta clase representa una tarea del modelo de datos de la aplicacion
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TareaSchema = new Schema({
    titulo: String,
    author: String,
    descripcion: String,
    fecha: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Tarea', TareaSchema);
