/* 
 * Aplicacion con autenticacion
 */

//--librerias
var express = require('express');
var app = express();
//configuracion
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var db  = require('./config/db');

//configurar express
app.use(morgan('combined'));//log's de app por consola
app.use(cookieParser());//leer cookies para auth
app.use(bodyParser.json());//obtener informacion de los forms de html
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');//configura ejs como templates

//requerido por passport
app.use(session({secret: 'aaalovethenodejswithexpress'}));//session secret
app.use(passport.initialize());
app.use(passport.session());//persistence login sessions
app.use(flash());//usando connect-flash para los mensajes flash stored in session

//--routes
require('./app/routes.js')(app, passport);//se cargan las rutas y passport en el app
require('./config/passport')(passport);

mongoose.connect(db.url);
var checkdb = mongoose.connection;
checkdb.on('open', function(){
    console.log('Conneccion BBDD ok');
});
checkdb.on('error', function(err){
    console.error.bind(console, 'error en la coneccion de BBDD')
});

//--ejecutar
app.listen(port);
console.log('La aplicacion esta ejecutandose en el puerto ' + port);