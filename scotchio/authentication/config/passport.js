/* 
 * Toda la configuracion referida a Passport
 */

//cargar lo necesario
var LocalStrategy = require('passport-local').Strategy;
//facebook strategy
var FacebookStrategy = require('passport-facebook').Strategy;
//twitter strategy
var TwitterStrategy = require('passport-twitter').Strategy;
//google strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//cargar el usuario
var Usuario = require('../app/models/usuario');

//cargar las variables de configuracion para auth
var configAuth = require('./auth');

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

  // --- FACEBOOK STRATEGY
  passport.use(new FacebookStrategy({
      //poner en el app los datos de nuestra configuracion
      clientID : configAuth.facebookAuth.clientID,
      clientSecret : configAuth.facebookAuth.clientSecret,
      callbackURL : configAuth.facebookAuth.callbackURL
  },
      //facebook nos reenvia el token y el profile
      function(token, refreshToken, profile, done){
          //asincronico
          process.nextTick(function(){
             //buscar en la base el usuario en base al facebook id
              Usuario.findOne({'facebook.id':profile.id}, function(err, user){
                 if (err)
                    return done(err);
                 if (user) {
                     //si lo encuentra vamos a retornar el usuario
                     return done(null, user);
                 } else {
                     //caso contrario vamos a crear uno nuevo y le seteamos la info necesaria
                     var newUser = new Usuario();
                     newUser.facebook.id = profile.id;
                     //guardamos el token del usuario
                     newUser.facebook.token = token;
                     newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                     //puede traer mas de un email, nos quedamos con el primero
                     newUser.facebook.email = profile.emails[0].value;

                     //guardar el usuario
                     newUser.save(function(err){
                         if (err){
                             throw err;
                         }
                         //ok devolvemos el usuario
                         return done(null, newUser);
                     });
                 }
              });
          });
      }
  ));

  //--Twitter Strategy
  passport.use(new TwitterStrategy({
      consumerKey : configAuth.twitterAut.consumerKey,
      consumerSecret : configAuth.twitterAut.consumerSecret,
      callbackURL : configAuth.twitterAut.callbackURL
  }, function(token, tokenSecret, profile, done){
      //codigo asincronico
      process.nextTick(function(){
         Usuario.findOne({'twitter.id':profile.id}, function(err, user){
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user);
            }else{
                var newUser = new Usuario();
                //seter toda la data que necesito
                newUser.twitter.id = profile.id;
                newUser.twitter.token = token;
                newUser.twitter.username = profile.username;
                newUser.twitter.displayName = profile.displayName;
                //guardar el nuevo usuario
                newUser.save(function(err){
                   if (err) {
                       throw err;
                   }
                   return done(null, newUser);
                });
            }
         });
      });
  }));
  
  //--- GOOGLE STRATEGY
  passport.use('google',new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL
  }), function(token, refreshToken, profile, done){
    //realizarlo de forma asincronica
        console.log('google strategy')
        process.nextTick(function() {
            Usuario.findOne({'google.id': profile.id}, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    //en caso de no estar creamos uno nuevo en la base de datos
                    var newUser = new Usuario();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    //nos quedamos con el primero
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.name = profile.displayName;
                    //guardar
                    newUser.save(function(err){
                       if (err)
                           throw err;
                       return done(null, newUser);
                    });
                }
            });
        });
    
  });
};
