/* 
 * Vamos a definir todas las rutas requeridas
 */
module.exports = function(app, passport) {
  //--home page con links de login
  app.get('/', function(req, res){
     res.render('index.ejs');//cargar el index 
  });
  //--login - formulario
  app.get('/login', function(req, res){
     res.render('login.ejs', {message: req.flash('loginMessage')}); 
  });
  //procesar el login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', //redirige al profile
      failureRedirect : '/login', //si hay error vuelve al login
      failureFlash : true //muestran mensajes de error
  }));
  
  //--signup - registracion en la aplicacion
  app.get('/signup', function(req, res){
     res.render('signup.ejs', {message: req.flash('signupMessage')});
  });
  //procesar el signup form - usando la estrategia local-signup
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', //redirige a la parte segura
      failureRedirect : '/signup', //si hay error redirige a la pagina de registro
      failureFlash : true //para mostrar mensajes de error
  }));
  
  //--profile - protegido vamos a usar un middleware para chequear si esta logeado
  app.get('/profile', isLoggedIn, function(req, res){
     res.render('profile.ejs', {user: req.user});//obtenemos el usario de la session y se lo pasamos al template
  });

  // -- routes de FACEBOOK para authenticacion y login
  app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));
  //capturar el callback despues que facebook autentique al usuario
  app.get('/auth/facebook/callback', passport.authenticate('facebook',{
      successRedirect:'/profile',
      failureRedirect:'/'
  }));

  // -- Routes de TWITTER
    //autenticacion y login de twitter
  app.get('/auth/twitter', passport.authenticate('twitter'));
    //manejar el callback luego que twitter identifique al usuario
    app.get('/auth/twitter/callback', passport.authenticate('twitter',{
      successRedirect: '/profile',
      failureRedirect: '/'
    }));
    
    // --- Routes de GOOGLE
    //agregar el profile
    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email']}), 
        function(req, res){
            console.log('paso');
        });
    //manejar el callback de google
    app.get('/auth/google/callback', passport.authenticate('google',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));
  
  //--logout - salir
  app.get('/logout', function(req, res){
     req.logOut();
     res.redirect('/');
  });
  
  //-- AUTORIZACION , el usuario esta logeado y quiere conectar a otras redes sociales
  //local
  app.get('/connect/local', function(req, res){
     res.render('connect-local.ejs', {message: req.flash('loginMessage')}); 
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/connect/local', //redirecciona al login si existe algun error
      failureFlash: true //permitir mensajes flash
  }));
  
  //facebook
  //enviar a facebook para autenticacion
  app.get('/connect/facebook', passport.authorize('facebook', {scope : 'email'}));
  //manejar el callback luego que facebook autorizo al usuario
  app.get('/connect/facebook/callback', passport.authorize('facebook',{
        successRedirect: '/profile',
        failureRedirect: '/'
   }));
   
   //twitter
  app.get('/connect/twitter', passport.authorize('twitter', {scope : 'email'}));
  app.get('/connect/twitter/callback', passport.authorize('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
  }));
  
  //google
  app.get('/connect/google', passport.authorize('google', {scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
  ]}));
  app.get('/connect/google/callback', passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
  }));
  // -- AUTORIZACION

  // -- rutas de desconeccion con las cuentas
    //local
  app.get('/unlink/local', function(req, res){
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err){
       res.redirect('/profile');
    });
  });
    //facebook
    app.get('/unlink/facebook', function(req, res){
       var user = req.user;
       user.facebook.token = undefined;
       user.save(function(err){
          res.redirect('/profile');
       });
    });
    //twitter
    app.get('/unlink/twitter', function(req, res){
       var user = req.user;
       user.twitter.token = undefined;
       user.save(function(err){
           res.redirect('/profile');
       });
    });
    //google
    app.get('/unlink/google', function(req, res){
       var user = req.user;
       user.google.token = undefined;
       user.save(function(err){
          res.redirect('/profile');
       });
    });
};

//router middleware para chequear de que el usuario este logeado
function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    //si no esta autenticado lo redirige a la home page
    res.redirect('/');
}
