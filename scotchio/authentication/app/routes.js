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
  //app.post('/login', passport va a ejecutar aca
  
  //--signup - registracion en la aplicacion
  app.get('/signup', function(req, res){
     res.render('signup.ejs', {message: req.flash('signupMessage')});
  });
  //procesar el signup form
  //app.post('/signup', passport hace su magia
  
  //--profile - protegido vamos a usar un middleware para chequear si esta logeado
  app.get('/profile', isLoggedIn, function(req, res){
     res.render('profile.ejs', {user: req.user});//obtenemos el usario de la session y se lo pasamos al template
  });
  
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
