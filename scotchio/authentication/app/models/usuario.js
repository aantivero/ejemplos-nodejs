/* 
 * Este representa el model de usuario
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//definicion del esquema
var usuarioSchema = mongoose.schema({
   local : {
       email : String,
       password : String
   } ,
   facebook : {
       id : String,
       token : String,
       email : String,
       name : String
   } ,
   twitter : {
       id : String,
       token : String,
       displayName : String,
       username : String
   } , 
   google : {
       id : String,
       token : String,
       email : String,
       name : String
   }
});

// -- metodos
//generar un hash
usuarioSchema.methods.generarHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);  
};
//chequear que la password sea valida
usuarioSchema.methods.validarPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);  
};
//crear el modelo usuario y exponerlo a la aplicacion
module.exports = mongoose.model('Usuario', usuarioSchema);