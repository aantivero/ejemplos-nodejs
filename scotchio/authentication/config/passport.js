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
      callbackURL : configAuth.facebookAuth.callbackURL,
      passReqToCallback : true
  },
      //facebook nos reenvia el token y el profile
      function(req, token, refreshToken, profile, done){
          //asincronico
          process.nextTick(function(){
              //voy a chequear si el usuario esta logeado
            if (!req.user) {
             //buscar en la base el usuario en base al facebook id
              Usuario.findOne({'facebook.id':profile.id}, function(err, user){
                 if (err)
                    return done(err);
                 if (user) {
                     //si existe el id pero no tiene token quiere decir que el usuario se desconecto
                     //por lo tanto vamos agregar el token y la informacion
                     if (!user.facebook.token) {
                         user.facebook.token = token;
                         user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                         user.facebook.email = profile.emails[0].value;
                         user.save(function(err){
                            if (err) {
                                throw err;
                            }
                            return done(null, user);
                         });
                     }
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
            } else {
                //el usuario esta logeado entonces vamos a linkear la cuenta
                //sacar el usuario de la session
                var user = req.user;
                
                //actualizar las credenciales actuales
                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;
                
                user.save(function(err){
                   if (err)
                       throw err;
                   return done(null, user);
                });
            }
          });
      }
  ));

  //--Twitter Strategy
  passport.use(new TwitterStrategy({
      consumerKey : configAuth.twitterAut.consumerKey,
      consumerSecret : configAuth.twitterAut.consumerSecret,
      callbackURL : configAuth.twitterAut.callbackURL,
      passReqToCallback : true
  }, function(req, token, tokenSecret, profile, done){
      //codigo asincronico
      process.nextTick(function(){
        if (!req.user) {
         Usuario.findOne({'twitter.id':profile.id}, function(err, user){
            if (err) {
                return done(err);
            }
            if (user) {
                //si lo encuentra por el id pero no tiene token quiere decir que desconecto la cuenta
                //por lo tanto vamos a guardar el token y lo relacionado con esta
                if (!user.twitter.token) {
                    user.twitter.token = token;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;
                    user.save(function(err){
                       if (err) {
                           throw err;
                       }
                       return done(null, user);
                    });
                }
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
        } else {
            //autorizar para agregar twitter a una cuenta existente
            //linkear el usuario
            var user = req.user;
            user.twitter.id = profile.id;
            user.twitter.token = token;
            user.twitter.username = profile.username;
            user.twitter.displayName = profile.displayName;
            //guardar el usuario
            user.save(function(err){
               if (err) {
                   throw err;
               } 
               return done(null, user);
            });
        }
      });
  }));
  
  //--- GOOGLE STRATEGY
  passport.use('google',new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL,
    passReqToCallback : true
  }), function(req, token, refreshToken, profile, done){
    //realizarlo de forma asincronica
        process.nextTick(function() {
            //chequear si el usuario esta logeado
            if (!req.user) {
                Usuario.findOne({'google.id': profile.id}, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        //chequear que el usuario tenga token sino cargar los datos correspondientes
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.email = profile.emails[0].value;
                            user.google.name = profile.displayName;
                            user.save(function(err){
                               if (err) {
                                   throw err;
                               }
                               return done(null, user);
                            });
                        }
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
            } else {
                var user = req.user;
                user.google.id = profile.id;
                user.google.token = token;
                user.google.email = profile.emails[0].value;
                user.google.name = profile.displayName;
                
                user.save(function(err){
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    
  });
};
