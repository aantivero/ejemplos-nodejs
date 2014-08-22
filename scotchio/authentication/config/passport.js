/* 
 * Toda la configuracion referida a Passport
 */

//cargar lo necesario
var LocalStrategy = require('passport-local').Strategy;

//cargar el usuario
var Usuario = require('../app/models/usuario');

//expone la funcion a la aplicacion
module.exports = function(passport) {
  //passport session setup, requerido para persistir la session de login
  //passport necesita serializar y desserializar usuarios por fuera de la session
  passport.serializeUser(function(user, done){//usado para seralizar al usuario en la session
     done(null, user.id); 
  });
  passport.deserializeUser(function(id, done){//usado para deserializar el usuario
     Usuario.findById(id, function(err, user){
        done(err, user); 
     }); 
  });
  
  //--Registro Local
  //estrategia para el registro de usuarios locales
  passport.use('local-signup', new LocalStrategy({
      //por default el local strategy utliza username y password, vamos a sobreescribir email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true //permite pasar toda la solicitud de la llamada
  }, 
  function(req, email, password, done){
      //asincrono
      //Usuario.findOne no se dispara hasta que la data se envia
      process.nextTick(function(){
          //buscar usuario con email igual al form
         Usuario.findOne({'local.email' : email}, function(err, user){
           if (err)
               return done(err);
           //chequear que existe uno con ese email
           if (user) {
               return done(null, false, req.flash('signupMessage','El email ya se encuentra registrado'));
           } else {
               //no existe usuario con es email
               var newUsuario = new Usuario();
               //setear las credenciales locales
               newUsuario.local.email = email;
               newUsuario.local.password = newUsuario.generarHash(password);
               //guardar
               newUsuario.save(function(err){
                  if (err)
                      throw err;
                  return done(null, newUsuario);
               });
           }
         }); 
      });
  }));
  
  //estrategia para el login-local
  passport.use('local-login', new LocalStrategy({
      //por default utiliza username y password, sobreescribimos para usar email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true //
  }, function(req, email, password, done){
     //callback con email y password de nuestro form
     Usuario.findOne({'local.email' : email}, function(err, user){
        //chequear si existe algun error
        if (err)
            done(err);
        //no se encuentra el usuario
        if (!user)
            return done(null, false, req.flash('loginMessage', 'Usuario no encontrado'));
        if (!user.validarPassword(password))
            return done(null, false, req.flash('loginMessage', 'Error al ingresar la password no coincide'));
        
        //si todo esta ok devuelve success
        return done(null, user);
     });
  }));
};
