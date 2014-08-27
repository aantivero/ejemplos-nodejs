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

  
  //--logout - salir
  app.get('/logout', function(req, res){
     req.logOut();
     res.redirect('/');
  });
};

//router middleware para chequear de que el usuario este logeado
function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    //si no esta autenticado lo redirige a la home page
    res.redirect('/');
}
